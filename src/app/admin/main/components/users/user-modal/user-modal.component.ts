import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MyErrorStateMatcher } from '../../../../../directives/error-directive.directive';
import { SharedService } from '../../../../../services/shared.service';
import { MESSAGE } from '../../../../../utils/messages';
import { User, UserData } from '../../../../../models/user.model';
import { TranslateService } from '../../../../../services/translate.service';
import { UserService } from '../../../../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { GridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  userModalForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  isFormSubmitted: boolean = false;
  hide: boolean = true;
  newUser: UserData = new UserData('', '', '', false);
  enabled: any;
  isEdit: boolean = false;
  disabledVariable: boolean = false;
  private disabledVariable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.disabledVariable);

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<User>,
    public dialogRef: MatDialogRef<UserModalComponent>,
    public sharedService: SharedService,
    private translateService: TranslateService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.isEdit = true;
      this.createFormEdit();
      this.enabled = this.userModalForm?.get('enabled')?.value;
      this.userModalForm.get('username')?.patchValue(this.data.content.username);
      this.userModalForm.get('fullName')?.patchValue(this.data.content.fullName);
      this.userModalForm.get('enabled')?.patchValue(this.data.content.enabled);
      if (this.userModalForm.get('username')?.value) {
        this.userModalForm.get('username')?.disable();
      }
    } else {
      this.createFormNew();
      this.enabled = this.userModalForm?.get('enabled')?.value;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  setDisabled(value: boolean) {
    this.disabledVariable$.next(value);
  }

  getDisabled() {
    return this.disabledVariable$.getValue();
  }

  createFormEdit(): FormGroup {
    return (this.userModalForm = this.fb.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      password: [''],
      passwordRepeat: [''],
      enabled: [false],
    }));
  }

  createFormNew(): FormGroup {
    return (this.userModalForm = this.fb.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      enabled: [false],
    }));
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.newUser = this.userModalForm.value;
    if (!this.userModalForm.valid) {
      this.translateService.showMessage(MESSAGE.error_user_input);
      return;
    }
    if (this.userModalForm.valid) {
      this.setDisabled(true);
      this.getDisabled();
      if (this.userModalForm.get('password')?.value !== this.userModalForm.get('passwordRepeat')?.value) {
        this.translateService.showMessage(MESSAGE.error_password_change);
        return;
      }
      if (this.data) {
        this.userService
          .edit(
            {
              fullName: this.newUser.fullName,
              password: this.newUser.password,
              enabled: this.newUser.enabled,
              username: this.data.content.username,
            },
            this.data.id,
          )
          .subscribe({
            next: () => {
              this.sharedService.openSnackBar(MESSAGE.success_put);
              this.closeModal();
              this.sharedService.reloadGrid();
            },
            error: errorMessage => {
              this.setDisabled(false);
              errorMessage.appCode
                ? this.translateService.showMessage(errorMessage.appCode)
                : this.translateService.showMessage(MESSAGE.error_user_edit);
            },
          });
      } else {
        this.userService
          .post({
            fullName: this.newUser.fullName,
            password: this.newUser.password,
            enabled: this.newUser.enabled,
            username: this.newUser.username,
          })
          .subscribe({
            next: () => {
              this.sharedService.openSnackBar(MESSAGE.success_post);
              this.closeModal();
              this.sharedService.reloadGrid();
            },
            error: errorMessage => {
              this.setDisabled(false);
              errorMessage.appCode
                ? this.translateService.showMessage(errorMessage.errorCode)
                : this.translateService.showMessage(MESSAGE.error_user_save);
            },
          });
      }
    }
  }
}
