import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ADMIN_ITEMS, CONTROLLER_ITEMS, MenuItem, OPERATOR_ITEMS } from '../models/menu-items.model';
import { Role } from '../models/user.model';
import { SessionService } from './session';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  get menuItems$(): Observable<MenuItem[]> {
    return this.session.getUserData().pipe(
      map((user: any) => {
        if (user.roles.includes(Role.ADMIN) && user.roles.includes(Role.CONTROLLER)) {
          return [...ADMIN_ITEMS, ...CONTROLLER_ITEMS];
        } else if (user.roles.includes(Role.ADMIN) && user.roles.includes(Role.OPERATER)) {
          return [...ADMIN_ITEMS, ...OPERATOR_ITEMS];
        } else if (user.roles.includes(Role.ADMIN)) {
          return ADMIN_ITEMS;
        } else if (user.roles.includes(Role.CONTROLLER)) {
          return CONTROLLER_ITEMS;
        } else if (user.roles.includes(Role.OPERATER)) {
          return OPERATOR_ITEMS;
        } else {
          return [];
        }
      }),
    );
  }

  constructor(private session: SessionService) {}
}
