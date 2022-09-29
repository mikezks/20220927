import { createFeatureSelector } from "@ngrx/store";
import * as fromReducer from "./passenger.reducer";

export const selectPassengerState = createFeatureSelector<fromReducer.State>(fromReducer.passengersFeatureKey)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = fromReducer.adapter.getSelectors(selectPassengerState);
