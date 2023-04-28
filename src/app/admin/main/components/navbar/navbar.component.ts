import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, Subscription, switchMap, tap } from 'rxjs';
import { LogoutModalComponent } from '../../../../modals/logout-modal/logout-modal.component';
import { User } from '../../../../models/user.model';
import { ToggleSideBar } from '../../../../utils/sidebar-toggle';
import { ChangePasswordModalComponent } from '../../../../modals/change-password-modal/change-password-modal.component';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MESSAGE } from '../../../../utils/messages';
import { SharedService } from '../../../../services/shared.service';
import { SessionService } from '../../../../services/session';
import { RxStompService } from '../../../../services/rx-stomp.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  subscription: Subscription = new Subscription();
  user: User;

  constructor(
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private rxStompService: RxStompService,
    private sharedService: SharedService,
    private session: SessionService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.loggedIn$
        .pipe(
          filter(loggedIn => loggedIn),
          tap(() => this.user = this.session.getUser()),
          switchMap(() => this.rxStompService.watch(`/users/${this.user.id}`)),
          map(response => response.body),
        )
        .subscribe((message) => {
          const socketBody = JSON.parse(message);
          if (socketBody && socketBody.summary) {
            this.sharedService.reloadGrid();
            this.sharedService.openSnackBar(socketBody.summary);
          } else {
            if (socketBody.status === 'STARTED' && socketBody.type === 'ACTIVATE') {
              this.sharedService.openSnackBarWait(MESSAGE.activation_in_progress, 'Zatvori');
            } else if (socketBody.status === 'COMPLETED' && socketBody.type === 'ACTIVATE') {
              setTimeout(() => {
                this.sharedService.reloadGrid();
              }, 400);
              this.sharedService.openSnackBar(MESSAGE.success_activation_plan);
            } else if (socketBody.status === 'FAILED' && socketBody.type === 'ACTIVATE') {
              this.sharedService.reloadGrid();
              this.sharedService.openSnackBarError(MESSAGE.error_activating_plan);
            }
            if (socketBody.status === 'STARTED' && socketBody.type === 'UPLOAD') {
              this.sharedService.openSnackBarWait(MESSAGE.upload_in_progress, 'Zatvori');
            } else if (socketBody.status === 'COMPLETED' && socketBody.type === 'UPLOAD') {
              this.sharedService.reloadGrid();
              this.sharedService.openSnackBar(MESSAGE.success_upload);
            } else if (socketBody.status === 'FAILED' && socketBody.type === 'UPLOAD') {
              this.sharedService.reloadGrid();
              this.sharedService.openSnackBarError(MESSAGE.error_upload_plan);
            }
            if (socketBody.status === 'STARTED' && socketBody.type === 'DUPLICATE') {
              this.sharedService.openSnackBarWait(MESSAGE.duplicate_plan_in_progress, 'Zatvori');
            } else if (socketBody.status === 'COMPLETED' && socketBody.type === 'DUPLICATE') {
              this.sharedService.reloadGrid();
              this.sharedService.openSnackBar(MESSAGE.success_duplicate_plan);
            } else if (socketBody.status === 'FAILED' && socketBody.type === 'DUPLICATE') {
              this.sharedService.reloadGrid();
              this.sharedService.openSnackBarError(MESSAGE.error_duplicate_plan);
            }
            if (socketBody.status === 'STARTED' && socketBody.type === 'CUT') {
              this.sharedService.openSnackBarWait(MESSAGE.cut_plan_in_progress, 'Zatvori');
            } else if (socketBody.status === 'COMPLETED' && socketBody.type === 'CUT') {
              this.sharedService.reloadGrid();
              this.sharedService.openSnackBar(MESSAGE.cut_plan_success);
            } else if (socketBody.status === 'FAILED' && socketBody.type === 'CUT') {
              this.sharedService.reloadGrid();
              this.sharedService.openSnackBarError(MESSAGE.error_cut_plan);
            }
          }
        })
    );
  }

  toggleSideBar() {
    ToggleSideBar.toggle();
  }

  openDialog() {
    this.dialog.open(LogoutModalComponent);
  }

  changePasswordDialog() {
    this.dialog.open(ChangePasswordModalComponent, {
      width: '480px',
      minHeight: 'auto',
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
