import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'src/app/models/menu-items.model';
import { MenuService } from 'src/app/services/menu.service';
import { SessionService } from 'src/app/services/session';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems$: Observable<MenuItem[]>;
  constructor(private session: SessionService, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems$ = this.menuService.menuItems$;
  }
}
