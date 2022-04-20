import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemService } from '../../shared/SystemService';
import { KeyValueString } from '../../shared/common_model';
import { AlertType } from '../../shared/common_model';


@Component({
    moduleId: module.id,
    templateUrl: './outgoing_server.html'
})

export class Outgoing_ServerComponent {
    isLoading = false;
    public LanguageList: Array<KeyValueString> = [];
    constructor(public fb: FormBuilder, public service: SystemService, public router: Router) {
        this.service.GoTo_ScrollTop(window);

        this.initForm();
    }
    ngOnInit() {
        this.bindData();
    }

    //Add/Edit 
    OutgoingEmail_ServerForm: FormGroup;
    initForm() {
        this.OutgoingEmail_ServerForm = this.fb.group({
            host: ["", Validators.required],
            userName: ["", Validators.required],
            password: ["", Validators.required],
            port: ["", Validators.required],
            enableSsl: [false],
            defaultCredentials: [false],
            fromEmail: [""],
            fromEmailAlias: [""]
        });
    }
    async bindData() {
        try {
            let res = await this.service.Data.ExecuteAPI_Post<any>("Admin/Get_Outgoing_Server");
            if (res) {
                this.OutgoingEmail_ServerForm.patchValue(res);
            }
        } catch (e) { }
    }

    async SaveOutgoing_Server() {
        try {
                this.service.App.ShowLoader = true;
                let res = await this.service.Data.ExecuteAPI_Post<number>("Admin/Update_Outgoing_Server", this.OutgoingEmail_ServerForm.getRawValue());
                if (res > 0) {
                    this.service.showMessage(AlertType.Success, this.service.Translator.instant("msgOutgoingEmailServerUpdated"));
                }
                else {
                    this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgError"));
                }
                this.service.App.ShowLoader = false;

        } catch (e) {
            this.service.App.ShowLoader = false;
        }
    }

    async TestOutgoing_Server() {
        try {
            this.service.App.ShowLoader = true;
            let res = await this.service.Data.ExecuteAPI_Post<number>("Admin/Test_Outgoing_Server", this.OutgoingEmail_ServerForm.getRawValue());
            if (res > 0) {
                this.service.showMessage(AlertType.Success, this.service.Translator.instant("msgOutgoingEmailServerConnectionSuccess"));
            }
            else {
                this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgOutgoingEmailServerConnectionFailed"));
            }
            this.service.App.ShowLoader = false;
        } catch (e) {
            this.service.App.ShowLoader = false;
        }
    }

}