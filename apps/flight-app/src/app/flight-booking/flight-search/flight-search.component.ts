import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, tap } from 'rxjs';
import * as fromFlightBooking from '../+state';


export interface Filter {
  from: string;
  to: string;
  urgent: boolean;
}

export interface LocalState {
  filters: Filter[];
  flights: Flight[];
}

export const initialLocalState: LocalState = {
  filters: [],
  flights: []
};


@Component({
  selector: 'flight-search',
  /* standalone: true,
  imports: [
    FlightCardComponent
  ], */
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  providers: [
    ComponentStore
  ]
})
export class FlightSearchComponent implements OnInit {

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;
  flights$ = this.globalStore.select(fromFlightBooking.selectActiveUserFlights);

  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };
  selectedFilter = { from: 'Hamburg', to: 'Graz', urgent: false };

  /**
   * Updater
   */

  addFilter = this.localStore.updater(
    (state, filter: Filter) => ({
      ...state,
      filters: [
        ...state.filters,
        filter
      ]
    })
  );

  setFlights = this.localStore.updater(
    (state, flights: Flight[]) => ({
      ...state,
      flights
    })
  );

  /**
   * Selectors
   */

  selectFilters$ = this.localStore.select(
    // Selectors

    // Projector
    state => state.filters
  );

  selectFlights$ = this.localStore.select(
    // Selectors

    // Projector
    state => state.flights
  );

  selectViewModel$ = this.localStore.select(
    // Selectors
    this.selectFilters$,
    this.flights$,
    // Projector
    (filters, flights) => ({
      filters, flights
    })
  );

  /**
   * Side-Effects
   */

  searchFlights = this.localStore.effect(
    (filter$: Observable<Filter>) =>
      filter$.pipe(
        switchMap(filter => this.flightService.find(
          filter.from,
          filter.to,
          filter.urgent
        )),
        map(flights => this.setFlights(flights))
      )
  );

  triggerGlobalFlightLoad = this.localStore.effect(
    (filter$: Observable<Filter>) =>
      filter$.pipe(
        tap(filter => this.globalStore.dispatch(
          fromFlightBooking.FlightBookingActions.flightsLoad({
            from: filter.from,
            to: filter.to,
            urgent: filter.urgent
          })
        ))
      )
  );

  constructor(
    private globalStore: Store,
    private localStore: ComponentStore<LocalState>,
    private flightService: FlightService) {

    this.localStore.setState(initialLocalState);

    this.selectFlights$.subscribe(console.log);
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  search(): void {
    if (!this.from || !this.to) return;

    const filter = {
      from: this.from,
      to: this.to,
      urgent: this.urgent
    };

    this.addFilter(filter);
    this.searchFlights(filter);

    this.globalStore.dispatch(
      fromFlightBooking.FlightBookingActions.flightsLoad({
        from: this.from,
        to: this.to,
        urgent: this.urgent
      })
    );
  }

  delay(flight: Flight): void {
    this.globalStore.dispatch(
      fromFlightBooking.FlightBookingActions.flightUpdate({
        flight: {
          ...flight,
          date: addMinutesToDate(flight.date, 15).toISOString(),
          delayed: true
        }
      })
    );
  }
}


export const addMinutesToDate = (date: Date | string, minutes: number): Date => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Date(dateObj.getTime() + minutes * 60 * 1_000);
};
