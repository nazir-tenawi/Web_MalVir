import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { SystemService } from '../../shared/SystemService';
import { AlertType } from '../../shared/common_model';


@Component({
    moduleId: module.id,
    templateUrl: './logo.html'
})

export class LogoComponent {
    isLoading = false;
    public LogoName: string = "";
    public allowedExtensions: Array<string> = ["png", "jpg", "jpeg", "gif", "bmp"];
    public imageUrl: string;
    constructor(public fb: FormBuilder, public service: SystemService, public router: Router) {
        this.service.GoTo_ScrollTop(window);
        this.initForm();
    }
    ngOnInit() {
        this.bindData();
    }

    //Add/Edit 
    LogoForm: FormGroup;
    @ViewChild('f') form: NgForm;
    initForm() {
        this.LogoForm = this.fb.group({
            ApplicationSettingID: [0],
            CompanyLogo: [""],
            CompanyTitle: [""],
        });
    }
    async bindData() {
        try {
            let res = await this.service.Data.ExecuteAPI_Post<ApplicationSetting_Model>("Admin/Get_ApplicationSetting");
            if (res) {
                this.LogoForm.patchValue(res);
                if (res.CompanyLogo) {
                    let cdt = this.service.Date_Format(new Date(), 'yyyyMMddHHmmss');
                    this.imageUrl = this.service.Settings.Base_API_URL + "/Documents/Attachments/" + res.CompanyLogo + "?" + cdt;
                }
                else {
                    this.imageUrl = "/assets/images/old_logo.png";
                }
            }
        } catch (e) { }
    }

    async SaveLogo() {
        try {

                this.service.App.ShowLoader = true;
                let obj = this.LogoForm.getRawValue();
                obj.CompanyLogo = this.imageUrl ? this.imageUrl : obj.CompanyLogo;
                obj.LogoName = this.LogoName;

                let res = await this.service.Data.ExecuteAPI_Post<number>("Admin/Logo_Update", obj);
                if (res > 0) {
                    this.service.showMessage(AlertType.Success, this.service.Translator.instant("msgSettingSaved"));
                    this.service.App.RefreshData.emit();
                }
                else {
                    this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgError"));
                }
                this.service.App.ShowLoader = false;


        } catch (e) {
            this.service.App.ShowLoader = false;
        }
    }

    //logo   
    fileChange(event: any) {
        let file = event.target.files[0];
        if (file) {
            let extension = file.name.replace(/^.*\./, '');
            if (this.allowedExtensions.indexOf(extension.toLowerCase()) > -1) {
                var myReader: FileReader = new FileReader();
                myReader.onloadend = (e) => {
                    this.imageUrl = <string>myReader.result;
                    this.LogoName = file.name;
                }
                myReader.readAsDataURL(file);
            }
            else {
                this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgSelectValidImage"));
            }
        }
    }

}

interface ApplicationSetting_Model {
    LogoID: number;
    DefaultLanguage: string;
    DefaultPassword: string;
    CompanyTitle: string;
    CompanyLogo: string;
}