import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToggleSideBar } from 'src/app/utils/sidebar-toggle';
import { SharedService } from 'src/app/services/shared.service';
import { Version } from 'src/app/models/shared.model';
import { MenuItem } from 'src/app/models/menu-items.model';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent  {
  toggleSideBar: ToggleSideBar = new ToggleSideBar();
  version$: Observable<Version> = this.sharedService.getCopyrightMarker();
  menuItems$: Observable<MenuItem[]> = this.menuService.menuItems$;

  constructor(
    private sharedService: SharedService,
    private menuService: MenuService
  ) {}

}
