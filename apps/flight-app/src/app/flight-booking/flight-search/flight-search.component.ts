import {Component, OnInit} from '@angular/core';
import {FlightService} from '@flight-workspace/flight-lib';
import { Store } from '@ngrx/store';
import { flightsLoaded } from '../+state/flight-booking.actions';
import { FlightBookingRootState } from '../+state/flight-booking.reducer';
// import { FlightCardComponent } from '../flight-card/flight-card.component';

@Component({
  selector: 'flight-search',
  /* standalone: true,
  imports: [
    FlightCardComponent
  ], */
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;
  flights$ = this.store.select(state => state.flightBooking.flights);

  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  constructor(
    private flightService: FlightService,
    private store: Store<FlightBookingRootState>) {
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.flightService
      .find(this.from, this.to, this.urgent)
      .subscribe(
        flights => this.store.dispatch(
          flightsLoaded({ flights })
        )
      );
  }

  delay(): void {
    this.flightService.delay();
  }

}
