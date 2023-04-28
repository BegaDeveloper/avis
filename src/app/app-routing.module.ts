import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'main',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/main/main.module').then(m => m.MainModule),
  },
  { path: 'login', component: AuthenticationComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

export const exemptRoutes: string[] = ['/login', '/display-track*', '/display-track?'];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
