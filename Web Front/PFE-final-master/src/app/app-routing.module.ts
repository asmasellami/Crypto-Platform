
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TestComponent } from './test/test.component';
import { VerifEmailComponent } from './verif-email/verif-email.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FuturesComponent } from './futures/futures.component';
import { OptionsComponent } from './options/options.component';
import { PerpetualsComponent } from './perpetuals/perpetuals.component';
import { MenuComponent } from './menu/menu.component';
import { FuturesFilterComponent } from './futures-filter/futures-filter.component';
import { OptionsFilterComponent } from './options-filter/options-filter.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { dashboardAdminGuard } from './dashboard-admin.guard';
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


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'test', component: TestComponent},
  { path: 'verifEmail', component: VerifEmailComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  {path: "", redirectTo: "login", pathMatch: "full" },
  {path:"futures",component:FuturesComponent},
  {path:"options",component:OptionsComponent},
  {path:"perpetuals",component:PerpetualsComponent},
  {path:"menu",component:MenuComponent},
  {path: 'futuresFilter', component: FuturesFilterComponent},
  {path: 'optionsFilter', component: OptionsFilterComponent},
  {path: 'dashboard', component: DashboardAdminComponent ,canActivate:[dashboardAdminGuard]},
  {path: 'forbidden', component: ForbiddenComponent},
  {path:"alert",component:AlertComponent},
  { path: 'updateUser/:id', component: UpdateUserComponent ,canActivate:[dashboardAdminGuard] },
  { path: 'profile', component: ProfileComponent },
  {path:"updateDetails",component:UpdateDetailsComponent},
  {path:"addUser",component:AddUserComponent ,canActivate:[dashboardAdminGuard]},
  {path:"addAlert",component:CreateAlertComponent},
  {path:"notification",component:NotificationComponent},
  {path:"chat",component:ChatComponent},
  {path:"home",component:HomeComponent},
  {path: 'updateAlert/:id', component: UpdateAlertComponent },
  {path: "channel", component: ChannelComponent },
  {path: 'ticker/:id', component: FuturesDetailsComponent },
  {path: 'tickerOpt/:id', component: OptionsDetailsComponent },
  { path: 'currency/:id', component: PerpetualsDetailsComponent },
  {path:"chatbot",component:ChatbotComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
