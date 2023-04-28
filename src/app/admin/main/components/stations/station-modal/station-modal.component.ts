import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { Station, StationData } from 'src/app/models/stations.model';
import { StationService } from 'src/app/services/station.service';
import { SharedService } from 'src/app/services/shared.service';
import { MESSAGE } from 'src/app/utils/messages';
import { TranslateService } from '../../../../../services/translate.service';
import { MyErrorStateMatcher } from '../../../../../directives/error-directive.directive';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-station-modal',
  templateUrl: './station-modal.component.html',
  styleUrls: ['./station-modal.component.scss'],
})
export class StationModalComponent implements OnInit, OnDestroy {
  stationForm: FormGroup = this.fb.group({
    stationType: ['', Validators.required],
    name: ['', Validators.required],
    name1: ['', Validators.required],
    name2: ['', Validators.required],
    name4: ['', Validators.required],
    licensed: [false],
    externalId: ['', Validators.required],
  });
  licensed: any;
  subscription: Subscription = new Subscription();
  stationsEnum = [
    { value: 'STATION', name: 'Stanica' },
    { value: 'STOP', name: 'Stajalište' },
  ];
  newStation: StationData = new StationData('', '', '', '', '', false, '');
  matcher = new MyErrorStateMatcher();
  isFormSubmitted: boolean = false;
  private _disabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<Station>,
    private clipboard: Clipboard,
    private router: Router,
    private stationService: StationService,
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<StationModalComponent>,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.licensed = this.stationForm.get('licensed')?.value;
    if (this.data) {
      this.stationForm.patchValue(this.data.content);
    }
  }

  set disabled(value: boolean) {
    this._disabled.next(value);
  }

  get disabled$(): Observable<boolean> {
    return this._disabled.asObservable();
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.newStation = this.stationForm.value;
    if (!this.stationForm.valid) {
      this.translateService.showMessage(MESSAGE.error_station_input);
      return;
    }
    if (this.stationForm.valid) {
      this.disabled = true;
      if (this.data.content) {
        this.subscription.add(
          this.stationService.edit(this.newStation, this.data.id).subscribe({
            next: () => {
              this.sharedService.openSnackBar(MESSAGE.success_put);
              this.sharedService.reloadGrid();
              this.closeModal();
            },
            error: errorMessage => {
              this.disabled = false;
              errorMessage.appCode
                ? this.translateService.showMessage(errorMessage.appCode)
                : this.translateService.showMessage(MESSAGE.error_station_edit);
            },
          }),
        );
      } else {
        this.subscription.add(
          this.stationService.post(this.newStation).subscribe({
            next: () => {
              this.sharedService.openSnackBar(MESSAGE.success_post);
              this.sharedService.reloadGrid();
              this.closeModal();
            },
            error: errorMessage => {
              this.disabled = false;
              errorMessage.appCode
                ? this.translateService.showMessage(errorMessage.appCode)
                : this.translateService.showMessage(MESSAGE.error_station_save);
            },
          }),
        );
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
