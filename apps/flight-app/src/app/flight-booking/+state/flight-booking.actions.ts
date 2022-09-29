import { Flight } from '@flight-workspace/flight-lib';
import { createActionGroup, props } from '@ngrx/store';


export const FlightBookingActions = createActionGroup({
  source: 'Flight Booking',
  events: {
    'Flights load': props<{ from: string, to: string, urgent: boolean }>(),
    'Flight update': props<{ flight: Flight }>(),
    'Flights loaded': props<{ flights: Flight[] }>(),
    'Flights loaded error': props<{ err: Error }>()
  }
});
