import { Injectable } from '@angular/core';
import { FlightService } from '@flight-workspace/flight-lib';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { FlightBookingActions } from './flight-booking.actions';


@Injectable()
export class FlightBookingEffects {

  loadFlights$ = createEffect(() =>
    /**
     * Stream 1: Action Observable
     *  - Trigger
     *  - Data Provider
     */
    this.actions$.pipe(
      // Filtering
      ofType(FlightBookingActions.flightsLoad),
      /**
       * Stream 2: Http Backend API call -> Flights
       *  - Data Provider
       */
      switchMap(action => this.flightService.find(
        action.from,
        action.to,
        action.urgent
      )),
      // Transformation: Convert Flights to Action
      map(flights => FlightBookingActions.flightsLoaded({ flights }))
    )
  );

  constructor(
    private actions$: Actions,
    private flightService: FlightService) {}
}
