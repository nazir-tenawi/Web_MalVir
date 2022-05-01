import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../shared/SystemService';
import { KeyValueString, ApiResponse, UserManagement_Model } from '../shared/common_model';
import { AlertType } from '../shared/common_model';

@Component({
    moduleId: module.id,
    templateUrl: './signup.component.html'
})

export class SignupComponent {
    isLoading = false; returnUrl: string; key: string;
    SignupForm: FormGroup; ForgotPwdForm: FormGroup;
    LanguageList: Array<KeyValueString> = []; SelectedLang: KeyValueString;
    response: any = {};
    sessionExpirationSeconds: number = 60 * 60;
    IsSignupForm: boolean = true;
    IsForgotPwdForm: boolean = false;
	public imageUrl: string = "/assets/images/profile.png";
	ProfilePictureName: string = "";
    allItems: Array<UserManagement_Model> = [];
	public UserID: number = 0;
    
    constructor(public fb: FormBuilder, public route: ActivatedRoute, public router: Router, public service: SystemService, public location: Location) {
        this.service.HasAccountData.then(() => {
            if (this.service.Account.UserID > 0) {
                this.router.navigate(['']);//redirect to dashboard page
            }
        });
        this.initSignupForm();
    }
    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    }
    ngAfterViewInit() {
        if (this.service.Settings.Expiration_Time) { this.sessionExpirationSeconds = this.service.Settings.Expiration_Time * 60; }
    }
    initSignupForm() {
        this.SignupForm = this.fb.group({
            username: ["", Validators.required],
            password: ["", Validators.required],
            phoneNo: ["", Validators.required],
            email: ["", Validators.required],
            displayName: ["", Validators.required],
        });

        this.ForgotPwdForm = this.fb.group({
            username: ['', Validators.required],
        });

    }


    RedirectToLogin() {
        this.service.App.ShowLoader = false;
        this.router.navigate(['login']);//redirect to dashboard page
    }
    async Signup() {
        try {
            this.isLoading = true;

            let obj = this.SignupForm.getRawValue();
            let res = await this.service.Data.ExecuteAPI_Post<any>("Admin/UserManagement_Signup", obj);
            console.log("🚀 ~ file: signup.component.ts ~ line 93 ~ SignupComponent ~ Signup ~ res", res)
            this.RedirectToLogin();
            // if (res.isSuccess) {                
            //     let expiration_date = new Date();
            //     expiration_date.setSeconds(expiration_date.getSeconds() + this.sessionExpirationSeconds);
            //     this.service.App.setCookie("Bearer", res.data, expiration_date);
            //     this.service.Data.SetHttpOptions();

            //     await this.service.loadAccountDetail();

            //     console.log("🚀 ~ file: signup.component.ts ~ line 103 ~ SignupComponent ~ Signup ~ this.service.Account", this.service.Account)
            //     if (this.service.Account.Is_Agent) {
            //             if (this.returnUrl && this.returnUrl != '' && this.returnUrl != '/') {
            //                 this.router.navigate([this.returnUrl]);
            //             }
            //             else { this.router.navigate(['']); }
            //     }
            //     else {
            //             //redirect to requester dashboard page
            //             if (this.returnUrl && this.returnUrl != '' && this.returnUrl != '/') {
            //                 this.router.navigate([this.returnUrl]);
            //             }
            //             else { this.router.navigate(['/']); }
            //     }
            // }
            // else {
            //     this.service.showMessage(AlertType.Error, res.msg);
            // }
            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
        }
    }



    async SaveUserManagement() {
		try {
			let obj = this.SignupForm.getRawValue();

				this.service.App.ShowLoader = true;
				obj.UserID = obj.UserID == null ? 0 : obj.UserID;
				obj.ProfilePicture = this.imageUrl ? this.imageUrl : obj.ProfilePicture;
				obj.ProfilePictureName = this.ProfilePictureName;

				let index = this.allItems.findIndex(d => d.UserName == obj.UserName && d.UserID != obj.UserID);//check username exists or not                
				if (index < 0) {
					let res = await this.service.Data.ExecuteAPI_Post<number>("Admin/UserManagement_Signup", obj);
					if (res > 0) {
						this.service.showMessage(AlertType.Success, this.service.Translator.instant("msgUserSaved"));



						// if (this.UserID > 0 || this.Is_Agent_Only) {

						// } else {
						// 	//go to list when not come from profile link
						// 	this.Is_Edit_Form = false;
						// 	this.clearForm();
						// }


					}
					else {
						this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgError"));
					}
				}
				else {
					if (index > -1) {
						this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgUserAlreadyExists"));
					}
				}
				this.service.App.ShowLoader = false;


		} catch (e) {
			this.service.App.ShowLoader = false;
		}
	}

}