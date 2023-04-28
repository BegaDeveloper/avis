import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NewTrainData, Train, TrainCategory } from 'src/app/models/trains.modal';
import { SharedService } from 'src/app/services/shared.service';
import { TrainService } from 'src/app/services/train.service';
import { MESSAGE } from 'src/app/utils/messages';
import { CategoryService } from '../../../../../services/category.service';
import { TranslateService } from '../../../../../services/translate.service';
import { MyErrorStateMatcher } from '../../../../../directives/error-directive.directive';
import { Operator } from '../../../../../models/operators.model';
import { OperatorsService } from '../../../../../services/operators.service';
import { GridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-train-modal',
  templateUrl: './train-modal.component.html',
  styleUrls: ['./train-modal.component.scss'],
})
export class TrainModalComponent implements OnInit, OnDestroy {
  trainForm: FormGroup = this.fb.group({
    id: ['', Validators.required],
    operatorId: ['', Validators.required],
    categoryId: ['', Validators.required],
    name: [''],
  });
  newTrain: NewTrainData = new NewTrainData('', '', '', '');
  operators$: Observable<Operator[]> = this.operatorService.get();
  categories$: Observable<TrainCategory[]> = this.categoryService.get();
  isFormSubmitted: boolean = false;
  matcher = new MyErrorStateMatcher();
  subscription: Subscription = new Subscription();
  private _disabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<TrainModalComponent>,
    public sharedService: SharedService,
    private fb: FormBuilder,
    private trainService: TrainService,
    private categoryService: CategoryService,
    private operatorService: OperatorsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<Train>,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.trainForm.patchValue(this.data.content);
      this.trainForm.get('operatorId')?.patchValue(this.data.content.operator.id);
      this.trainForm.get('categoryId')?.patchValue(this.data.content.trainCategory.id);
      if (this.trainForm.get('id')?.value) {
        this.trainForm.get('id')?.disable();
      }
    }
  }

  set disabled(value: boolean) {
    this._disabled.next(value);
  }

  get disabled$(): Observable<boolean> {
    return this._disabled.asObservable();
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.newTrain = this.trainForm.value;
    if (!this.trainForm.valid) {
      this.translateService.showMessage(MESSAGE.error_train_input);
      return;
    }
    if (this.trainForm.valid) {
      this.disabled = true;
      if (this.data) {
        this.subscription.add(
          this.trainService
            .update(
              {
                id: this.data.id,
                operatorId: this.newTrain.operatorId,
                categoryId: this.newTrain.categoryId,
                name: this.newTrain.name,
              },
              this.data.id,
            )
            .subscribe({
              next: () => {
                this.sharedService.openSnackBar(MESSAGE.success_post);
                this.closeModal();
                this.sharedService.reloadGrid();
              },
              error: error => {
                this.disabled = false;
                error.appCode
                  ? this.translateService.showMessage(error.appCode)
                  : this.translateService.showMessage(MESSAGE.error_train_update);
              },
            }),
        );
      } else {
        this.subscription.add(
          this.trainService.post(this.newTrain).subscribe({
            next: () => {
              this.sharedService.openSnackBar(MESSAGE.success_post);
              this.closeModal();
              this.sharedService.reloadGrid();
            },
            error: error => {
              this.disabled = false;
              error.appCode
                ? this.translateService.showMessage(error.appCode)
                : this.translateService.showMessage(MESSAGE.error_train_save);
            },
          }),
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
