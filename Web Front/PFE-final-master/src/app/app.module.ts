import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptor } from './services/token.interceptor';
import { TestComponent } from './test/test.component';
import { VerifEmailComponent } from './verif-email/verif-email.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FuturesComponent } from './futures/futures.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OptionsComponent } from './options/options.component';
import { PerpetualsComponent } from './perpetuals/perpetuals.component';
import { MenuComponent } from './menu/menu.component';
import { NumberFormatterPipe } from './number-formatter.pipe';

import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { FuturesFilterComponent } from './futures-filter/futures-filter.component';
import { OptionsFilterComponent } from './options-filter/options-filter.component';
import { PerpetualsFilterComponent } from './perpetuals-filter/perpetuals-filter.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AlertComponent } from './alert/alert.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateDetailsComponent } from './update-details/update-details.component';
import { AddUserComponent } from './add-user/add-user.component';
import { CreateAlertComponent } from './create-alert/create-alert.component';
import { NotificationComponent } from './notification/notification.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { UpdateAlertComponent } from './update-alert/update-alert.component';
import { ChannelComponent } from './channel/channel.component';
import { FuturesDetailsComponent } from './futures-details/futures-details.component';
import { OptionsDetailsComponent } from './options-details/options-details.component';
import { PerpetualsDetailsComponent } from './perpetuals-details/perpetuals-details.component';
import { ChatbotComponent } from './chatbot/chatbot.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TestComponent,
    VerifEmailComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    FuturesComponent,
    OptionsComponent,
    PerpetualsComponent,
    MenuComponent,
    NumberFormatterPipe,
    FuturesFilterComponent,
    OptionsFilterComponent,
    PerpetualsFilterComponent,
    DashboardAdminComponent,
    ForbiddenComponent,
    AlertComponent,
    UpdateUserComponent,
    ProfileComponent,
    UpdateDetailsComponent,
    AddUserComponent,
    CreateAlertComponent,
    NotificationComponent,
    ChatComponent,
    HomeComponent,
    UpdateAlertComponent,
    ChannelComponent,
    FuturesDetailsComponent,
    OptionsDetailsComponent,
    PerpetualsDetailsComponent,
    ChatbotComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgxPaginationModule,
    TableModule,
    DropdownModule,


  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,

  }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
