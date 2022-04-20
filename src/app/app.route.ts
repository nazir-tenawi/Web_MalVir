import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard'

import { ScanComponent } from './scan/scan';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PageNotFoundComponent } from './not-found.component';

import { ProfileComponent } from './profile/profile';
import { ResetPasswordComponent } from './reset_password/reset_password';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'reset_password/:key', component: ResetPasswordComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', component: ScanComponent, canActivate: [AuthGuard] },
    { path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule), data: { pageProp: 'Show_History_Menu' }, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, data: { pageProp: 'Is_Profile_Visible_Client' }, canActivate: [AuthGuard] },

    //Admin
    { path: 'admin/basic', loadChildren: () => import('./admin_setting/basic/basic.module').then(m => m.BasicModule), data: { pageProp: 'Show_Admin_Menu' }, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: () => import('./admin_setting/user/user.module').then(m => m.UserModule), data: { pageProp: 'Show_Admin_Menu' }, canActivate: [AuthGuard] },
    { path: 'admin/general', loadChildren: () => import('./admin_setting/general/general.module').then(m => m.GeneralModule), data: { pageProp: 'Show_Admin_Menu' }, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: () => import('./admin_setting/branding/branding.module').then(m => m.BrandingModule), data: { pageProp: 'Show_Admin_Menu' }, canActivate: [AuthGuard] },
    { path: 'admin/mail', loadChildren: () => import('./admin_setting/mailsetting/mailsetting.module').then(m => m.MailSettingModule), data: { pageProp: 'Show_Admin_Menu' }, canActivate: [AuthGuard] },
        
    { path: '**', component: PageNotFoundComponent }
];


