import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouteParams } from '../../+state';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
})
export class FlightEditComponent implements OnInit {
  id = 0;
  showDetails = false;
  showWarning = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store) {
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.id = +p['id'];
      this.showDetails = p['showDetails'] === 'true';
    });

    this.store.select(selectRouteParams).subscribe(console.log);
  }

  decide(answer: boolean) {
    console.log('decide', answer);
  }
}
