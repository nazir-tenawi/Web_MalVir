import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, NgForm, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../../shared/SystemService';

import { PasswordValidation } from '../../shared/array.pipe';
import { ModalDialog } from '../../shared/modal.dialog';
import { AlertType } from '../../shared/common_model';

@Component({
    moduleId: module.id,
    selector: 'change-password',
    templateUrl: './change_password.html'
})

export class Change_PasswordComponent {
    isLoading = false; returnUrl: string;
    ChangePasswordForm: FormGroup;
    public UserName: string;
    @Output('onSave') public onSave: EventEmitter<any> = new EventEmitter();
    @ViewChild('f') form: NgForm;
    @ViewChild("modalChangePwd") modalChangePwd: ModalDialog;

    constructor(public fb: FormBuilder, public route: ActivatedRoute, public router: Router, public service: SystemService,
        public location: Location) {

        this.service.HasAccountData.then((data) => {
            this.UserName = this.service.Account.UserName;;
        });
        this.initForm();
    }
    ngOnInit() {
    }
    initForm() {
        this.ChangePasswordForm = this.fb.group({
            password: ["", Validators.required],
            confirmPassword: ["", Validators.required]
        }, {
            validator: PasswordValidation.MatchPassword // your validation method
        });
    }

    async ChangePassword() {
        try {
                this.isLoading = true;
                let res = await this.service.Data.ExecuteAPI_Post<number>("Admin/ChangePassword", { Password: this.ChangePasswordForm.value.password });
                if (res && res > 0) {
                    this.modalChangePwd.close();
                    this.onSave.emit();
                    this.service.showMessage(AlertType.Success, this.service.Translator.instant("msgPasswordChanged"));
                    window.setTimeout(() => { this.service.logOut(); }, 1000);
                }
                this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
        }
    }

    public open() {
        this.modalChangePwd.open();
        this.initForm();
    }

}
