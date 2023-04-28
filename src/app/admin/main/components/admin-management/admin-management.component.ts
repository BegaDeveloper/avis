import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminManagementService } from '../../../../services/admin-management.service';
import { MESSAGE } from '../../../../utils/messages';
import { SharedService } from '../../../../services/shared.service';
import { TranslateService } from '../../../../services/translate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
})
export class AdminManagementComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  constructor(
    private adminService: AdminManagementService,
    public sharedService: SharedService,
    public translateService: TranslateService,
  ) {}

  ngOnInit(): void {}

  clearCache() {
    this.subs.push(
      this.adminService.clearCache().subscribe({
        next: res => {
          this.sharedService.openSnackBar(MESSAGE.success_cache_clear);
        },
        error: error => {
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.translateService.showMessage(MESSAGE.error_cache_clear);
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: any) => {
      sub.unsubscribe();
    });
  }
}
