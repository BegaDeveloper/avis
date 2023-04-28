import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route, RouteData, RouteItem } from 'src/app/models/routes.model';
import { RoutesService } from 'src/app/services/routes.service';
import { SharedService } from 'src/app/services/shared.service';
import { StationService } from 'src/app/services/station.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';
import { MyErrorStateMatcher } from '../../../../../directives/error-directive.directive';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Station } from '../../../../../models/stations.model';
import { GridModal } from '../../../../../models/grid-modal';

export interface RouteRow {
  stationId: Station;
  via: boolean;
}

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss'],
})
export class AddRouteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollMe') private myScroll: ElementRef<HTMLDivElement>;
  routeForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    stationId: [''],
    routeItemDataList: this.fb.array([]),
  });
  stations: any;
  route: RouteData = new RouteData('', []);
  lastInArray: any;
  disableBtn: boolean = false;
  counter: number = 0;
  isFormSubmitted: boolean = false;
  matcher = new MyErrorStateMatcher();
  stationForAdd: any;
  displayedColumns = ['NAZIV STANICE', 'PREKO', 'AKCIJE'];
  _routeItems: BehaviorSubject<RouteRow[]> = new BehaviorSubject<RouteRow[]>([]);
  isEdit = false;
  subscription: Subscription = new Subscription();
  disabledVariable: boolean = false;
  private disabledVariable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.disabledVariable);

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    private routeService: RoutesService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<Route>,
    public dialogRef: MatDialogRef<AddRouteComponent>,
    private translateService: TranslateService,
    private stationService: StationService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.scrollBottom();
    }, 100);
    if (this.data) {
      this.isEdit = true;
      this.routeForm.get('name')?.setValue(this.data.content.name);
      let routeItems = this.data.content.routeItems;

      routeItems.forEach(routeItem =>
        this.routeItemDataList.push(this.returnCurrent(routeItem))
      );

      this._routeItems.next(routeItems.map(routeItem => {
        return {
          stationId: routeItem.station,
          via: routeItem.via,
        } as RouteRow;
      }));

      this.onOptionChange(routeItems[routeItems.length - 1].station);
    }

    if (!this.isEdit) {
      this.getStations();
    }
  }

  ngAfterViewInit() {
    this.scrollBottom();
  }

  setDisabled(value: boolean) {
    this.disabledVariable$.next(value);
  }

  getDisabled() {
    return this.disabledVariable$.getValue();
  }

  scrollBottom() {
    this.myScroll.nativeElement.scrollIntoView();
  }

  returnCurrent(item: RouteItem) {
    return this.fb.group({
      stationId: [item.station],
      via: [item.via],
    });
  }

  returnStationName(station: any) {
    if (station?.name) {
      return station?.name;
    } else {
      if (station?.stationNext) {
        return station?.stationNext?.name;
      }
    }
  }

  returnContentStationName(content: any) {
    if (content?.stationId.name) {
      return content.stationId?.name;
    } else {
      return content?.stationId.stationNext?.name;
    }
  }

  isLastInArray(content: any, lastinArray: any) {
    if (
      content?.stationId.id === lastinArray?.stationId.id &&
      content.stationId.stationNext &&
      lastinArray.stationId.stationNext
    ) {
      return true;
    } else if (
      content?.stationId.id === lastinArray?.stationId.id &&
      !content.stationId.stationNext &&
      !lastinArray.stationId.stationNext
    ) {
      return true;
    }
    return false;
  }

  closeModal() {
    this.counter = 0;
    this.dialogRef.close();
    this.sharedService.reloadGrid();
  }

  getStations() {
    this.subscription.add(
      this.stationService.get().subscribe({
        next: (res: any) => {
          this.stations = res;
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err ? this.translateService.showMessage(err) : this.translateService.showMessage(MESSAGE.error_station_get);
          });
        },
      }),
    );
    this.disableBtn = false;
  }

  get routeItemDataList(): FormArray {
    return this.routeForm.get('routeItemDataList') as FormArray;
  }

  removeStation(i: number) {
    const control = <FormArray>this.routeForm.controls['routeItemDataList'];
    control.removeAt(i);
    setTimeout(() => {
      this.lastInArray = this.routeItemDataList.value.at(-1);
      if (this.lastInArray && control.value) {
        if (this.lastInArray?.stationId?.stationNext) {
          this.getSubStation(this.lastInArray.stationId?.stationNext.id);
        } else if (this.lastInArray?.stationId?.id) {
          this.getSubStation(this.lastInArray.stationId?.id);
        }
      } else {
        this.routeItemDataList.value.empty;
        this.counter = 0;
        this.getStations();
      }
    }, 100);
    this._routeItems.next(this.routeItemDataList.value);
    this.stationForAdd = '';
    this.routeForm.value.stationId = '';
  }

  matSelectValue(stations: any) {
    if (stations?.length === 1) {
      return stations[0];
    }
  }

  getSubStation(id: number) {
    this.subscription.add(
      this.stationService.getSubsequentStations(id).subscribe((res: any) => {
        setTimeout(() => {
          this.stations = res;

          this.disableBtn = this.stations.length < 2;

          if (this.routeItemDataList.value.length > 1) {
            const lastObject = this.routeItemDataList.value[this.routeItemDataList.value.length - 2];
            const stationsArr = this.stations;
            //delete duplicate station that we've just come from
            for (let j = 0; j < stationsArr.length; j++) {
              if (lastObject.stationId.stationNext) {
                if (stationsArr[j].stationNext) {
                  if (stationsArr[j].stationNext.id == lastObject.stationId.stationNext.id) {
                    stationsArr.splice(j, 1);
                  }
                } else {
                  if (stationsArr[j].id == lastObject.stationId.stationNext.id) {
                    stationsArr.splice(j, 1);
                  }
                }
              } else {
                if (stationsArr[j].stationNext) {
                  if (stationsArr[j].stationNext.id == lastObject.stationId.id) {
                    stationsArr.splice(j, 1);
                  }
                } else {
                  if (stationsArr[j].id == lastObject.stationId.id) {
                    stationsArr.splice(j, 1);
                  }
                }
              }

              //delete possible duplicate station to avoid circular routes:
              for (let i = 0; i < this.routeItemDataList.value.length; i++) {
                for (let j = 0; j < stationsArr.length; j++) {
                  if (this.routeItemDataList.value[i].stationId.stationNext) {
                    if (stationsArr[j].stationNext) {
                      if (
                        this.routeItemDataList.value[i].stationId.stationNext.id == stationsArr[j].stationNext.id
                      ) {
                        stationsArr.splice(j, 1);
                      }
                    }
                  } else {
                    if (stationsArr[j].stationNext) {
                      if (this.routeItemDataList.value[i].stationId.id == stationsArr[j].stationNext.id) {
                        stationsArr.splice(j, 1);
                      }
                    } else {
                      if (this.routeItemDataList.value[i].stationId.id == stationsArr[j].id) {
                        stationsArr.splice(j, 1);
                      }
                    }
                  }
                }
              }
            }
            if (stationsArr.length === 0) {
              this.disableBtn = true;
            }
          }
        }, 200);
      }),
    );
  }

  routeItem() {
    return this.fb.group({
      stationId: [this.stationForAdd],
      via: [false],
    });
  }

  lastObjectCheck(id: any, lastObject: any) {
    if (lastObject?.stationId?.id) {
      if (id === lastObject.stationId.id) return true;
    } else {
      if (id === lastObject?.stationId.stationNext.id) return true;
    }
    return false;
  }

  viaValue(index: number) {
    return this.routeItemDataList.value[index].via === true;
  }

  toggleVia(content: any) {
    this.routeItemDataList.value.forEach((st: any) => {
      if (st.stationId.id === content.stationId.id) {
        st.via = !st.via;
      }
    });
  }

  addToArray() {
    const lastObject = this.routeItemDataList.value[this.routeItemDataList.value.length - 1];
    if (
      this.routeForm.value.stationId &&
      this.routeForm.value.stationId !== '' &&
      !this.lastObjectCheck(this.routeForm.value?.stationId?.id, lastObject)
    ) {
      this.stationForAdd = this.routeForm.value.stationId;
      this.routeItemDataList.push(this.routeItem());
      this.onOptionChange(this.stationForAdd);

      this._routeItems.next(this.routeItemDataList.value);

      this.stationForAdd = '';
      this.routeForm.value.stationId = '';
      setTimeout(() => {
        this.scrollBottom();
      }, 100);
    }
  }

  reset() {
    setTimeout(() => {
      this.counter = 0;
      while (this.routeItemDataList.value.length !== 0) {
        const control = <FormArray>this.routeForm.controls['routeItemDataList'];
        control.removeAt(0);
      }
      this.getStations();
      this._routeItems.next([]);
      this.stationForAdd = '';
      this.routeForm.value.stationId = '';
    }, 200);
  }

  onOptionChange(st: any) {
    if (st.stationNext) {
      this.getSubStation(st.stationNext.id);
    } else if (st.id) {
      this.getSubStation(st.id);
    }
    this.counter++;
    this.lastInArray = this.routeItemDataList.value.at(-1);
  }

  onSubmit() {
    this.counter = 0;
    this.isFormSubmitted = true;
    const routeArr = this.routeItemDataList.value;

    for (let j = 0; j < routeArr.length; j++) {
      if (routeArr[j].stationId.stationNext) {
        routeArr[j].stationId = routeArr[j].stationId.stationNext.id;
      } else if (routeArr[j].stationId) {
        routeArr[j].stationId = routeArr[j].stationId.id;
      }
    }

    this.route.name = this.routeForm.value.name;
    this.route.routeItemDataList = routeArr;
    if (!this.routeForm.valid || this.routeForm.value.routeItemDataList.length === 0) {
      this.reset();
      this.translateService.showMessage(MESSAGE.error_route_input);
      return;
    }
    if (this.routeForm.valid) {
      this.setDisabled(true);
      this.getDisabled();
      if (!this.isEdit) {
        this.routeService.post(this.route).subscribe({
          next: () => {
            this.closeModal();
            this.sharedService.openSnackBar(MESSAGE.success_post);
          },
          error: error => {
            this.setDisabled(false);
            error.appCode
              ? this.translateService.showMessage(error.appCode)
              : this.translateService.showMessage(MESSAGE.error_route_save);
          },
        });
      }
      if (this.isEdit) {
        this.routeService.put(this.route, this.data.content.id).subscribe({
          next: () => {
            this.closeModal();
            this.sharedService.openSnackBar(MESSAGE.success_post);
          },
          error: error => {
            this.setDisabled(false);
            error.appCode
              ? this.translateService.showMessage(error.appCode)
              : this.translateService.showMessage(MESSAGE.error_route_update);
          },
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
