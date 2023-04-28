import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiInterceptor } from './services/api.interceptor';
import { MainModule } from './admin/main/main.module';
import { AuthenticationComponent } from './components/authentication/authentication.component';

import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LogoutModalComponent } from './modals/logout-modal/logout-modal.component';
import { TranslateService } from './services/translate.service';
import { ChangePasswordModalComponent } from './modals/change-password-modal/change-password-modal.component';

import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { myCustomTooltipDefaults } from './utils/my-custom-tooltips-defaults';
import { RxStompService } from './services/rx-stomp.service';
import { RxStompServiceFactory } from './services/rx-stomp-service-factory';

@NgModule({
  declarations: [AppComponent, AuthenticationComponent, LogoutModalComponent, ChangePasswordModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MainModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'sr-Latn' },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults },
    DatePipe,
    TranslateService,
    {
      provide: RxStompService,
      useFactory: RxStompServiceFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
