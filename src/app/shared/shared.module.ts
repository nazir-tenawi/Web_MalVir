import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ModalDialog } from './modal.dialog';

import { SystemService } from './SystemService'
import { TranslateService } from './Translate/translate.service'
import { TranslatePipe } from './Translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './Translate/translations';

import { FilterArrayPipe, FilterArrayObjectPipe, SumPipe, SafeHtmlPipe, fileTypePipe } from './array.pipe'; // convert object to array pipe
import { NumberOnly, FocusInvalidDirective } from './app.directive';

import { commongrid_Component } from './grid/commongrid';
import { history_commongrid_Component } from './grid/history_commongrid';

//common page
import { Change_PasswordComponent } from '../admin_setting/user/change_password';
import { Row_ViewComponent } from '../scan/row_view';


//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AlertComponent } from './alert';
import { ChartsModule } from 'ng2-charts';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';




@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ChartsModule, Ng2FlatpickrModule, TypeaheadModule.forRoot()],
    declarations: [TranslatePipe, AlertComponent, ModalDialog, FilterArrayPipe, FilterArrayObjectPipe, SumPipe, SafeHtmlPipe, fileTypePipe, NumberOnly, FocusInvalidDirective, commongrid_Component, history_commongrid_Component,
       Change_PasswordComponent, Row_ViewComponent,
    ],
    exports: [FormsModule, ReactiveFormsModule, TranslatePipe, AlertComponent, ModalDialog, FilterArrayPipe, FilterArrayObjectPipe, SumPipe, SafeHtmlPipe, fileTypePipe,
        ChartsModule, Ng2FlatpickrModule, TypeaheadModule,
        NumberOnly, FocusInvalidDirective, commongrid_Component, history_commongrid_Component,
        Change_PasswordComponent, Row_ViewComponent,
    ],
})

export class SharedModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: SharedModule,
            providers: [SystemService, TranslateService, TRANSLATION_PROVIDERS]
        };
    }
}