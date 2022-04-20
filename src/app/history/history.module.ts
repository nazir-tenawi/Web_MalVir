
import { NgModule } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { History_ListComponent } from './history_list';
import { AuthGuard } from '../auth.guard';


const routes: Routes = [
    { path: '', component: History_ListComponent, data: { pageProp: 'Show_History_Menu' }, canActivate: [AuthGuard] },
];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
    declarations: [History_ListComponent],

})

export class HistoryModule {

}








