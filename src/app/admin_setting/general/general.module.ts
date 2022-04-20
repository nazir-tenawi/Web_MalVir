
import { NgModule } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { App_SettingComponent } from './app_setting';

const routes: Routes = [
    { path: 'app_setting', component: App_SettingComponent },

];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
    declarations: [App_SettingComponent],

})

export class GeneralModule {

}








