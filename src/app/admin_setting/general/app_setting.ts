import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { SystemService } from '../../shared/SystemService';
import { KeyValueString, AlertType } from '../../shared/common_model';

@Component({
    moduleId: module.id,
    templateUrl: './app_setting.html'
})

export class App_SettingComponent {
    isLoading = false;
    public LanguageList: Array<KeyValueString> = [];
    constructor(public fb: FormBuilder, public service: SystemService, public router: Router) {
        this.service.GoTo_ScrollTop(window);

        this.service.Get_Languages().then((res) => { this.LanguageList = res; });
        this.initForm();
    }
    ngOnInit() {
        this.bindData();
    }

    //Add/Edit 
    ApplicationSettingForm: FormGroup;
    @ViewChild('f') form: NgForm;
    initForm() {
        this.ApplicationSettingForm = this.fb.group({
            ApplicationSettingID: [0],
            DefaultPassword: [""],
        });
    }
    async bindData() {
        try {
            let res = await this.service.Data.ExecuteAPI_Post<ApplicationSetting_Model>("Admin/Get_ApplicationSetting");
            if (res) {
                this.ApplicationSettingForm.patchValue(res);
            }
        } catch (e) { }
    }

    async SaveApplicationSetting() {
        try {
            this.service.App.ShowLoader = true;
            let res = await this.service.Data.ExecuteAPI_Post<number>("Admin/ApplicationSetting_Update", this.ApplicationSettingForm.getRawValue());
            if (res > 0) {
                this.service.showMessage(AlertType.Success, this.service.Translator.instant("msgSettingSaved"));
            }
            else {
                this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgError"));
            }
            this.service.App.ShowLoader = false;
        } catch (e) {
            this.service.App.ShowLoader = false;
        }
    }

}

interface ApplicationSetting_Model {
    ApplicationSettingID: number;
    DefaultPassword: string;
    CompanyTitle: string;
    CompanyLogo: string;
}