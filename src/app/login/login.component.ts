import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../shared/SystemService';
import { KeyValueString, ApiResponse } from '../shared/common_model';
import { AlertType } from '../shared/common_model';

@Component({
    moduleId: module.id,
    templateUrl: './login.component.html'
})

export class LoginComponent {
    isLoading = false; returnUrl: string; key: string;
    LoginForm: FormGroup; ForgotPwdForm: FormGroup;
    response: any = {};
    sessionExpirationSeconds: number = 60 * 60;
    IsLoginForm: boolean = true;
    IsForgotPwdForm: boolean = false;

    constructor(public fb: FormBuilder, public route: ActivatedRoute, public router: Router, public service: SystemService, public location: Location) {
        this.service.HasAccountData.then(() => {
            if (this.service.Account.UserID > 0) {
                this.router.navigate(['']);//redirect to dashboard page
            }
        });
        this.initLoginForm();
    }
    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    }
    ngAfterViewInit() {
        if (this.service.Settings.Expiration_Time) { this.sessionExpirationSeconds = this.service.Settings.Expiration_Time * 60; }
    }
    initLoginForm() {
        this.LoginForm = this.fb.group({
            username: ["", Validators.required],
            password: ["", Validators.required],
        });

        this.ForgotPwdForm = this.fb.group({
            username: ['', Validators.required],
        });
    }

    CheckLogin(type: string) {
        this.service.App.ShowLoader = false;
        if (type == 'login') { this.IsLoginForm = true; this.IsForgotPwdForm = false; }
        else if (type == 'forgotpwd') { this.IsLoginForm = false; this.IsForgotPwdForm = true; }
    }
    async Login() {
        try {
            this.isLoading = true;

            let obj = this.LoginForm.getRawValue();
            let res = await this.service.Data.ExecuteAPI_Post<any>("Login/Login", obj);
            if (res.isSuccess) {                
                let expiration_date = new Date();
                expiration_date.setSeconds(expiration_date.getSeconds() + this.sessionExpirationSeconds);
                this.service.App.setCookie("Bearer", res.data, expiration_date);
                this.service.Data.SetHttpOptions();

                await this.service.loadAccountDetail();

                console.log("🚀 ~ file: login.component.ts ~ line 103 ~ LoginComponent ~ Login ~ this.service.Account", this.service.Account)
                if (this.service.Account.Is_Agent) {
                        if (this.returnUrl && this.returnUrl != '' && this.returnUrl != '/') {
                            this.router.navigate([this.returnUrl]);
                        }
                        else { this.router.navigate(['']); }
                }
                else {
                        //redirect to requester dashboard page
                        if (this.returnUrl && this.returnUrl != '' && this.returnUrl != '/') {
                            this.router.navigate([this.returnUrl]);
                        }
                        else { this.router.navigate(['/']); }
                }
            }
            else {
                this.service.showMessage(AlertType.Error, res.msg);
            }
            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
        }
    }

    async ForgotPassword() {
        try {
            this.isLoading = true;
            let res = await this.service.Data.ExecuteAPI_Post<number>("Home/ForgotPassword", { UserName: this.ForgotPwdForm.value.username, site_url: this.service.Settings.Site_URL });
            if (res != null && res > 0) {
                this.service.showMessage(AlertType.Success, this.service.Translator.instant("msgResetPasswordSendEmailLink"));
                this.ForgotPwdForm.controls["username"].setValue("");
                this.CheckLogin("login");
            }
            else if (res == -1) {
                this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgUsernameInCorrect"));
            }
            else {
                this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgError"));
            }

            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
        }
    }
}