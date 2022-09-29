import { createFeatureSelector, createSelector } from '@ngrx/store';
import { flightBookingFeature, State } from './flight-booking.reducer';

export const selectFlightBookingState = createFeatureSelector<State>(
  flightBookingFeature.name
);

export const selectFlights = createSelector(
  // Selectors
  selectFlightBookingState,
  // Projector
  (state) => state.flights
);

export const selectPassengers = createSelector(
  selectFlightBookingState,
  (state) => state.passenger
);

export const selectBookings = createSelector(
  selectFlightBookingState,
  (state) => state.bookings
);

export const selectUser = createSelector(
  selectFlightBookingState,
  (state) => state.user
);

export const selectActiveUserFlights = createSelector(
  // Selectors
  selectFlights,
  selectBookings,
  selectUser,
  // Projector
  (flights, bookings, user) => {
    const activeUserPassengerId = user.passengerId;
    const activeUserFlightIds = bookings
      .filter(b => b.passengerId === activeUserPassengerId)
      .map(b => b.flightId);
    const activeUserFlights = flights
      .filter(f => activeUserFlightIds.includes(f.id));

    return activeUserFlights;
  }
);
