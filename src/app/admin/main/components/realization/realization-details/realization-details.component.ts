import { Component, Optional, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { RealizationService } from 'src/app/services/realization.service';
import { ActionHistory, RealizationDetails, translationActions } from '../../../../../models/realization.model';

@Component({
  selector: 'app-realization-details',
  templateUrl: './realization-details.component.html',
  styleUrls: ['./realization-details.component.scss'],
})
export class RealizationDetailsComponent implements OnInit {
  name: string = 'Realizacija';
  id: number = this.data.id;
  actionHistory: Observable<ActionHistory[]> = this.realizationService.getActionHistory(this.id);
  dataSource: MatTableDataSource<ActionHistory> = new MatTableDataSource();

  displayedColumns: string[] = [
    'ID',
    'STATION',
    'KOLOSEK',
    'TRANZIT',
    'TIME_ARRIVAL',
    'TIME_DEPARTURE',
    'ARRIVAL_DELAY',
    'DEPARTURE_DELAY',
    'STATUS',
  ];

  displayedColumnsActionHistory: string[] = ['createdDate', 'action', 'station', 'delay', 'track', 'createdBy'];
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { id: number; data: RealizationDetails },
    public dialogRef: MatDialogRef<RealizationDetailsComponent>,
    private realizationService: RealizationService,
  ) {}

  ngOnInit(): void {
    this.actionHistory.subscribe((actionHistoryData: ActionHistory[]) => {
      this.dataSource.data = actionHistoryData;
    });
  }

  getActionTranslation(action: string): string {
    return translationActions[action];
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
