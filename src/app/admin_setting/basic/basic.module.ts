
import { NgModule } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { HashComponent } from './hash';



const routes: Routes = [
    { path: 'hash', component: HashComponent },

];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
    declarations: [HashComponent]
})

export class BasicModule {

}








