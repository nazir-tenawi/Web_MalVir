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
    parseFloat = parseFloat; sub: any;
    logoUrl = "/assets/images/old_logo.png"; 
    ProfilePicture = "/assets/images/profile.png";
    constructor(public router: Router, public route: ActivatedRoute, public service: SystemService) {
        this.service.HasAccountData.then(() => {
            this.bindData();
        });
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

    RedirectToLogin() {
        this.service.App.ShowLoader = false;
        this.router.navigate(['login']);//redirect to dashboard page
    }
    
}