import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css'],
})
export class FlightTypeaheadComponent {
  control = new FormControl();
  flights$: Observable<Flight[]> = this.getFlightsStream$();
  loading = false;

  constructor(private http: HttpClient) {}

  getFlightsStream$(): Observable<Flight[]> {
    const filterState$ = of({
      from: 'Frankfurt'
    });

    /**
     * Stream 1: Input values changes
     *  - Trigger
     *  (- Data Provider)
     */
    return this.control.valueChanges.pipe(
      /**
       * Stream 2: Filter State Provider
       *  - Data Provider
       */
      /* withLatestFrom(filterState$),
      // Transformation: Modify the resulting value
      map(([inputValue, filterState]) => filterState.from), */
      // Filtering START
      filter(city => city.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      // Filtering END
      // Side-effect: set a class property
      tap(() => this.loading = true),
      /**
       * Stream 2: Http Backend API call -> Flights
       *  - Data Provider
       */
      switchMap(city => this.load(city)),
      // Side-effect: set a class property
      tap(() => this.loading = false)
    );
  }

  load(from: string): Observable<Flight[]> {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});
  }
}
