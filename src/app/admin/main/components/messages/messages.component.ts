import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption, ThemePalette } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, interval, Observable, shareReplay } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { Premise, Station, Track } from 'src/app/models/stations.model';
import { StationService } from 'src/app/services/station.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { MessageService } from 'src/app/services/message.service';
import { MessageDTO } from 'src/app/models/message.model';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';
import { SharedService } from 'src/app/services/shared.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('tracks') tracks: MatSelect;
  @ViewChild('premises') premises: MatSelect;

  stations$: Observable<Station[]> = this.userService.getAuthUserStations();
  tracks$: Observable<Track[]>;
  premises$: Observable<Premise[]>;
  dateTimeControl = new FormControl(this.getCurrentTimeWithoutSeconds());
  checkboxChecked: boolean = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';

  matcher = new MyErrorStateMatcher();
  form: FormGroup;

  constructor(
    private translateService: TranslateService,
    private stationService: StationService,
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initStationSelectionObserver();
    this.autoSelectSingleStation();
  }

  initForm(): void {
    this.form = this.fb.group({
      stationId: [null, Validators.required],
      premiseIds: [[]],
      tracks: [[]],
      messageText: [null],
      emittingDateFrom: [null],
    });
  }

  initStationSelectionObserver(): void {
    this.form.get('stationId')?.valueChanges.subscribe((selectedStationId: number) => {
      this.tracks$ = this.stationService.getTrackById(selectedStationId);
      this.premises$ = this.stationService.getStationPremises(selectedStationId).pipe(shareReplay(1));
      this.form.get('tracks')?.reset([]);
      this.form.get('premiseIds')?.reset([]);
    });
  }

  autoSelectSingleStation(): void {
    this.stations$.subscribe((stations: Station[]) => {
      if (stations.length === 1) {
        this.form.get('stationId')?.setValue(stations[0].id);
      }
    });
  }

  getCurrentTimeWithoutSeconds(): Date {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setMinutes(now.getMinutes() + 1);
    return now;
  }

  submit() {
    const formData = this.prepareData();
    this.messageService.post(formData).subscribe({
      next: (res: MessageDTO) => {
        this.sharedService.openSnackBar(MESSAGE.success_message);
        this.resetForm();
      },
      error: (error: any) => {
        this.setDisabled(false);
        error.appCode
          ? this.translateService.showMessage(error.appCode)
          : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
      },
    });
  }

  onChange(event: MatCheckboxChange) {
    this.checkboxChecked = event.checked;
    if (event.checked) {
      this.dateTimeControl.disable();
    } else {
      this.dateTimeControl.enable();
    }
  }

  resetForm() {
    this.form.reset({
      stationId: this.form.get('stationId')?.value,
      premiseIds: [],
      tracks: [],
      messageText: null,
      emittingDateFrom: null,
    });
    this.tracks.options.forEach((data: MatOption) => data.deselect());
    this.premises.options.forEach((data: MatOption) => data.deselect());
  }

  prepareData() {
    const data = this.form.value;
    data.emittingDateFrom = this.checkboxChecked ? null : this.dateTimeControl.value.toISOString();
    return data;
  }

  private disabledVariable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get disabledVariable$(): Observable<boolean> {
    return this.disabledVariable.asObservable();
  }

  setDisabled(value: boolean) {
    this.disabledVariable.next(value);
  }

  getDisabled() {
    return this.disabledVariable.getValue();
  }
}
