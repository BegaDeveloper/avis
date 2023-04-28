import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { OperatorsService } from 'src/app/services/operators.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddOperatorComponent } from './add-operator/add-operator.component';
import { Operator } from '../../../../models/operators.model';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss'],
})
export class OperatorsComponent implements AfterViewInit, OnDestroy {
  data: Operator[];
  displayedColumns: string[] = ['ID', 'NAME', 'LOGO', 'SMALL_LOGO'];
  subscription: Subscription= new Subscription();

  constructor(
    private sharedService: SharedService,
    private service: OperatorsService,
    private dialog: MatDialog,
  ) {}

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(
        this.sharedService.gridReload$
      ).pipe(
        startWith({}),
        switchMap(() => {
          return this.service.get();
        }),
        map(data => data === null ? [] : data),
      ).subscribe(data => this.data = data)
    );
  }

  openDialog() {
    this.dialog.open(AddOperatorComponent, {
      width: '600px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
