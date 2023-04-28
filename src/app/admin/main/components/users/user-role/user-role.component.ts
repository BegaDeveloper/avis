import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../../../services/shared.service';
import { TranslateService } from '../../../../../services/translate.service';
import { UserService } from '../../../../../services/user.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MESSAGE } from '../../../../../utils/messages';
import { Subscription } from 'rxjs';
import { Role, User } from '../../../../../models/user.model';
import { GridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit, OnDestroy {
  currentlyCheckedRoles: Role[] = [];
  subscription: Subscription = new Subscription();
  rolesArray: Array<any> = [
    { name: 'Admin', value: 'ADMIN' },
    { name: 'Kontrolor', value: 'CONTROLLER' },
    { name: 'Operator', value: 'OPERATER' },
  ];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<User>,
    public dialogRef: MatDialogRef<UserRoleComponent>,
    public sharedService: SharedService,
    private translateService: TranslateService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.currentlyCheckedRoles = this.data.content.roles;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  onChecked(event: MatCheckboxChange, role: any) {
    if (event.checked) {
      this.currentlyCheckedRoles.push(role);
    } else {
      for (let i = 0; i < this.currentlyCheckedRoles.length; i++) {
        if (this.currentlyCheckedRoles[i] === role) {
          if (this.currentlyCheckedRoles.length > 1) this.currentlyCheckedRoles.splice(i, 1);
          else if (this.currentlyCheckedRoles.length === 1) this.currentlyCheckedRoles = [];
        }
      }
    }
  }

  onSubmit() {
    if (this.data) {
      this.subscription.add(
        this.userService.postRoles(this.currentlyCheckedRoles, this.data.id).subscribe({
          next: () => {
            this.sharedService.openSnackBar(MESSAGE.success_put);
            this.currentlyCheckedRoles = [];
            this.closeModal();
          },
          error: errorMessage => {
            errorMessage.appCode
              ? this.translateService.showMessage(errorMessage.appCode)
              : this.translateService.showMessage(MESSAGE.error_user_role_save);
          },
        }),
      );
    }
  }

  isRole(role: Role) {
    let isSentRole = false;
    if (this.data) {
      this.data.content.roles.forEach((rol: any) => {
        if (rol === role) isSentRole = true;
      });
    }
    return isSentRole;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
