import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from '../shared/SystemService';
import { KeyValueString } from '../shared/common_model'

@Component({
    moduleId: module.id,
    selector: 'app-header',
    templateUrl: './header.html'
})
export class HeaderComponent {

    LanguageList: Array<KeyValueString> = []; selectedLang = "EN"; selectedLang_Key = "English";



    parseFloat = parseFloat; sub: any;
    logoUrl = "/assets/images/old_logo.png"; 
    ProfilePicture = "/assets/images/profile.png";
    constructor(public router: Router, public route: ActivatedRoute, public service: SystemService) {
        this.service.HasAccountData.then(() => {
            this.bindData();
        });
        this.get_language_list();
    }
    ngOnInit() {
        //for check requester or agent        
        if (window.location.href.indexOf("/") > -1) {
            this.service.Account.Is_Agent = false;
            this.service.Account.Is_Show_ClientPortal_Link = false;
        }

        this.sub = this.service.App.RefreshData.subscribe(this.bindData.bind(this));

    }
    ngOnDestroy() {
        if (this.sub) { this.sub.unsubscribe(); }
    }
    async bindData() {
        console.log("🚀 ~ file: header.ts ~ line 35 ~ HeaderComponent ~ bindData ~ this.service.Account", this.service.Account)
        let cdt = this.service.Date_Format(new Date(), 'yyyyMMddHHmmss');
        this.logoUrl = this.service.Settings.Base_API_URL + "/Documents/Attachments/logo.png";
        if (this.service.Account.ProfilePicture) { this.ProfilePicture = this.service.Settings.Base_API_URL + "/Documents/Profile/" + this.service.Account.ProfilePicture + "?" + cdt; }

    }
    async get_language_list() {
        this.LanguageList = await this.service.Get_Languages();
        if (localStorage.getItem("lang")) { this.selectedLang = localStorage.getItem("lang"); }
        // this.changeLanguage({ Key: this.selectedLang, Value: this.selectedLang }, false);
    }
    async changeLanguages(item: KeyValueString, IsApiRefresh = true) {
        location.reload();

        if (item.Value == item.Key) { item = this.LanguageList.find(d => d.Value == item.Value); }

        this.selectedLang = item.Value;
        this.selectedLang_Key = item.Key;
        localStorage.setItem("lang", item.Value);
        this.service.CL = item.Value;
        this.service.Translator.use(item.Value);
        setTimeout(() => { this.service.Set_RTL(); })


        if (IsApiRefresh) {
            //IsApiRefresh if this is pass true in signalR 'Get_Language_Refresh' then it could be infinite loop, so be carefull when play with this
            let res = await this.service.Data.ExecuteAPI_Post<any>("Admin/Set_Current_Languages", { lang: item.Value });
            this.service.Translator.set_data(res);
            //dummy set for reflect new changes            
            this.service.CL = 'dummy';
            setTimeout(() => { this.service.CL = item.Value; });
        }


    }
    RedirectToLogin() {
        this.service.App.ShowLoader = false;
        this.router.navigate(['login']);//redirect to dashboard page
    }
    
}