import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPassenger from '../+state';

@Component({
  selector: 'flight-workspace-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.css'],
})
export class PassengerComponent implements OnInit {
  passengers$ = this.store.select(fromPassenger.selectAll);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      fromPassenger.addPassengers({ passengers: [
        { id: 1, name: 'Sue' },
        { id: 2, name: 'John' }
      ]})
    );
  }
}
