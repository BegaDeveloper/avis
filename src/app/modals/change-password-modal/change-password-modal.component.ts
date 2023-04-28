import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGE } from '../../utils/messages';
import { TranslateService } from '../../services/translate.service';
import { SharedService } from '../../services/shared.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MyErrorStateMatcher } from '../../directives/error-directive.directive';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent implements OnInit {
  changePasswordForm: FormGroup;
  hide: boolean = true;
  appMessage = MESSAGE;
  isFormSubmitted: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<any>,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): FormGroup {
    return (this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordRepeat: ['', Validators.required],
    }));
  }

  changePasswordSubmit() {
    this.isFormSubmitted = true;
    if (
      this.changePasswordForm.get('newPasswordRepeat')?.value === this.changePasswordForm.get('newPassword')?.value &&
      this.changePasswordForm.valid
    ) {
      this.authService
        .changePassword(
          this.changePasswordForm.get('oldPassword')?.value,
          this.changePasswordForm.get('newPassword')?.value,
        )
        .subscribe({
          next: () => {
            this.sharedService.openSnackBar(MESSAGE.success_password_change);
            this.closeModal();
          },
          error: error => {
            error.appCode
              ? this.translateService.showMessage(error.appCode)
              : this.translateService.showMessage(MESSAGE.error_password_default);
          },
        });
    } else if (
      this.changePasswordForm.get('newPasswordRepeat')?.value !== this.changePasswordForm.get('newPassword')?.value
    ) {
      this.translateService.showMessage(MESSAGE.error_password_change);
    } else if (!this.changePasswordForm.valid) {
      this.translateService.showMessage(MESSAGE.error_password_change_empty_fields);
    }
  }

  validationMessage(controlName: string): boolean {
    let control = this.changePasswordForm.controls[controlName];
    return control.touched;
  }

  closeModal() {
    this.dialogRef.close();
    this.sharedService.reloadGrid();
  }
}
