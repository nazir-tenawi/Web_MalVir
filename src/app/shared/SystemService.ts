import { Injectable, EventEmitter } from '@angular/core';
import { Account_Model, Menu_Model, Settings_Model, KeyValueString, GridFilter } from './common_model';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//Start Alert Service
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { Alert, AlertType } from './common_model';
import 'rxjs/add/operator/filter';
import { timeout } from 'rxjs/operators';
//End Alert Service
//import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { DatePipe } from '@angular/common';

import { TranslateService } from './Translate/translate.service';
declare var $: JQueryStatic;

import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';
import { environment } from '../../environments/environment';


@Injectable()
export class SystemService {
    public App: AppHelper;
    public CL: string = "";
    public Data: DataHelper;
    public Account: Account_Model;
    public menu_Model: Menu_Model = <Menu_Model>{};

    public Settings: Settings_Model;

    public Storage_Key: typeof Storage_Key = Storage_Key;
    public StatusType: typeof StatusType = StatusType;

    public _dataPromise: Deferred<boolean> = new Deferred<boolean>();
    public get HasAccountData(): Promise<boolean> {
        return this._dataPromise.promise;
    }

    //Start Alert Service
    public subject = new Subject<Alert>();
    //public keepAfterRouteChange = false;
    //End Alert Service

    constructor(public route: ActivatedRoute, public router: Router, public http: HttpClient, public Translator: TranslateService) {
        //this.Settings = window["settings"];
        //this.Settings.API_URL = this.Settings.Base_API_URL + 'api/';
        this.Settings = <Settings_Model>{
            Base_API_URL: environment.Base_API_URL, Site_URL: environment.Site_URL, Expiration_Time: environment.Expiration_Time
        };
        this.Settings.API_URL = this.Settings.Base_API_URL + '/api';

        this.Account = <Account_Model>{};
        this.App = new AppHelper(this);
        this.Data = new DataHelper(http, this.App, this);
        Translator.init().then(() => { this.CL = "en"; });
        this.loadAccountDetail();
    }

    Date_Format(input: Date | string, format: string) {
        return new DatePipe("en-us").transform(input, format)
    }

    async loadAccountDetail(): Promise<boolean> {
        //window.setTimeout(async () => {
            console.log("🚀this.App.getCookie()", this.App.getCookie("Bearer"))
        if (this.App.getCookie("Bearer")) {
            try {
                let data = await this.Data.ExecuteAPI_Post<Account_Model>("Admin/Get_Account_Detail");
                console.log("🚀 ~ file: SystemService.ts ~ line 71 ~ SystemService ~ //window.setTimeout ~ data", data)

                let isagent = this.Account.Is_Agent;//for remember agent is in agent portal or client portal, so get old value                    
                this.Account = new Account_Model(data);
                if (isagent != undefined && isagent != null) { this.Account.Is_Agent = isagent };//for remember agent is in agent portal or client portal, so get old value                   
                this.Account.Is_Show_ClientPortal_Link = this.Account.Is_Agent;

                if (this.Account.UserID > 0) { this._dataPromise.resolve(true); }
                else { this._dataPromise.resolve(false); this.redirectToLogin(); }

            } catch (e) {
                this._dataPromise.resolve(false); this.redirectToLogin();
            }
        } else {
            this._dataPromise.resolve(false);
        }
        //}, 1);
        return this._dataPromise.promise;
    }

    redirectToLogin(returnUrl?: string) {
        this.Account = <Account_Model>{ UserID: 0, UserName: "" };
        if (returnUrl && returnUrl != '/')
            this.router.navigate(['login'], { queryParams: { returnUrl: returnUrl }, replaceUrl: true });
        else
            this.router.navigate(['login']);
    }
    goToDashboard() { this.router.navigate(['/']); }
    ClearToken() {
        this.App.setCookie("Bearer", "", 0);
        this.Account = <Account_Model>{ UserID: 0, UserName: "" };
    }
    logOut() {
        //this.Data.startConnection();
        this.resetPromise();
        this.App.setCookie("Bearer", "", 0);
        //this.Account = <Account_Model>{ UserID: 0, UserName: "" };
        this.redirectToLogin();
    }
    resetPromise() {
        this._dataPromise = new Deferred<boolean>();
    }

    GoTo_ScrollTop(wind: any) {
        try {
            wind.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
            $('body').removeClass('modal-open');
        } catch (ex) { }
    }

    Is_RTL() {
        return localStorage.getItem("lang") == 'AE';
    }
    Set_RTL() {
        if (this.Is_RTL()) {
            document.querySelector('html').classList.add('rtl');
        }
        else {
            document.querySelector('html').classList.remove('rtl');
        }
    }


    //Show/hide left menu
    ShowHide_LeftMenu(type = '') {
        if (type == 'admin') {
            if (this.menu_Model.Admin_Menu_Class == 'show-left-menu') { this.menu_Model.Admin_Menu_Class = 'hide-left-menu'; }
            else { this.menu_Model.Admin_Menu_Class = 'show-left-menu'; }
        }
        else {
            if (this.menu_Model.Main_Menu_Class == 'show-left-menu') { this.menu_Model.Main_Menu_Class = 'hide-left-menu'; }
            else { this.menu_Model.Main_Menu_Class = 'show-left-menu'; }
        }
    }
    async Get_Languages() {
        let lst: any = [
            { Key: 'Arabic', Value: 'AE' },
            { Key: 'Chinese', Value: 'TW' },
            { Key: 'Danish', Value: 'DK' },
            { Key: 'Dutch', Value: 'NL' },
            { Key: 'English', Value: 'EN' },
            { Key: 'French', Value: 'FR' },
            { Key: 'German', Value: 'DE' },
            { Key: 'Greek', Value: 'GR' },
            { Key: 'Hungarian', Value: 'HU' },
            { Key: 'Italian', Value: 'IT' },
            { Key: 'Japanese', Value: 'JP' },
            { Key: 'Polish', Value: 'PL' },
            { Key: 'Portuguese', Value: 'PT' },
            { Key: 'Russian', Value: 'RU' },
            { Key: 'Spanish', Value: 'ES' },
            { Key: 'Swedish', Value: 'SE' },
            { Key: 'Turkish', Value: 'TR' }
        ];
        return lst;
    }

    //Start Alert Service
    getAlert(alertId?: string): Observable<any> {
        return this.subject.asObservable().filter((x: Alert) => x && x.alertId === alertId);
    }
    showMessage(type, message) {
        if (type == AlertType.Success) { this.alert(new Alert({ message, type: AlertType.Success, cssClass: "alert-success" })); }
        else if (type == AlertType.Error) { this.alert(new Alert({ message, type: AlertType.Error, cssClass: "alert-danger" })); }
        else if (type == AlertType.Warning) { this.alert(new Alert({ message, type: AlertType.Warning, cssClass: "alert-warning" })); }
        else if (type == AlertType.Info) { this.alert(new Alert({ message, type: AlertType.Info, cssClass: "alert-info" })); }
    }
    // main alert method    
    alert(alert: Alert) {
        this.subject.next(alert);
    }
    // clear alerts
    clear(alertId?: string) { this.subject.next(new Alert({ alertId })); }
    //End Alert Service

    //random colors for Google charts
    lstColors = ['#7cb5ec', '#f45b5b', '#2b908f', '#e4d354', '#f15c80', '#8085e9', '#f7a35c', '#90ed7d', '#434348', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'];
    Get_Randon_Colors() {
        let lst = this.lstColors.reduce((p, n) => {
            const size = p.length;
            const index = Math.trunc(Math.random() * (size - 1));
            p.splice(index, 0, n);
            return p;
        }, []);
        return lst;
    }

    //random colors for ChartJs
    lst_BarColors = [{ backgroundColor: 'rgba(134,199,243,0.9)', borderColor: 'rgba(134,199,243,1)' }, { backgroundColor: 'rgba(144,237,125,0.9)', borderColor: 'rgba(144,237,125,1)' }, { backgroundColor: 'rgba(244,91,91,0.9)', borderColor: 'rgba(244,91,91,1)' }];
    Get_FixBarColors() { return this.lst_BarColors; }
    Get_Random_PieColors() {
        let lst = this.lstColors.reduce((p, n) => {
            const size = p.length;
            const index = Math.trunc(Math.random() * (size - 1));
            p.splice(index, 0, n);
            return p;
        }, []);
        return [{ backgroundColor: lst }];
    }


    //Round 2 Decimal Points
    RoundValue(n, d = 2) {
        let m = Math.pow(10, d);
        return Math.round(n * m) / m;
    }

    //Get Default Profile Image
    Default_Profile_Pic() { return "/assets/images/profile.png"; }

    Get_NotAllowedExtensions() { return ["js", "jsp", "apk", "bat", "bin", "cgi", "pl", "com", "exe", "gadget", "jar", "py", "wsf"]; }
}

class DataHelper {
    public objEvents: any = {};

    constructor(public http: HttpClient, public App: AppHelper, public service: SystemService) {
        this.SetHttpOptions();
    }



    public BearerToken = this.App.getCookie("Bearer");
    public httpOptions = { headers: new HttpHeaders() };

    public httpOptions_empty = { headers: new HttpHeaders() };
    SetHttpOptions() {
        this.BearerToken = this.App.getCookie("Bearer");
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*',
                'Authorization': 'Bearer ' + this.BearerToken
            })
        };
        this.httpOptions_empty = {
            headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.BearerToken })
        };
    }

    public httpOptions1 = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' as 'json' };
    ExecuteAPI_Post_Local<T>(action: string, params: any = {}): Promise<any> {
        let url = this.service.Settings.API_URL + action;
        return this.http.post<any>(url, params, this.httpOptions).toPromise<any>();
    }

    //API Common Method
    ExecuteAPI_Get<T>(action: string, params: any = {}): Promise<T> {
        action = this.service.Settings.API_URL + '/' + action;
        //return this.http.get<T>(action).toPromise<T>();
        return this.http.get<T>(action, { params: params, headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.BearerToken }) }).toPromise<T>().catch((err) => {
            throw err;
        });;
    }

    ExecuteAPI_Post<T>(action: string, params: any = {}): Promise<any> {
        let url = this.service.Settings.API_URL + '/' + action;
        //return this.http.post<any>(url, params, httpOptions).toPromise<any>();
        return this.http.post<T>(url, params, this.httpOptions).pipe(timeout(300000)).toPromise<T>().catch((err) => {
            throw err;
        });
    }
    ExecuteAPI_Post_Loader<T>(action: string, params: any = {}): Promise<any> {
        this.App.ShowLoader = true;
        let promise = this.ExecuteAPI_Post<T>(action, params);
        promise.then(() => { this.App.ShowLoader = false; }).catch((err) => { this.App.ShowLoader = false; throw err; });
        return promise;
    }
}

export class Deferred<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

class AppHelper {
    constructor(public service: SystemService) { }
    public ShowLoader: boolean = false; public AppLoader: boolean = true;
    public RefreshData: EventEmitter<any> = new EventEmitter();

    public searchFilter: EventEmitter<any> = new EventEmitter();
    public refreshGrid: EventEmitter<any> = new EventEmitter();
    public showhideColumnFilter: EventEmitter<any> = new EventEmitter();
    public clearAllCheckbox: EventEmitter<any> = new EventEmitter();

    public _appData: any = {};
    GetData<T>(key: string): T {
        return (<T>this._appData[key]);
    }
    SetData(key: string, data: any) {
        this._appData[key] = data;
    }
    setCookie(cname, cvalue, date: Date | number) {
        let d = new Date();
        if (date instanceof Date) {
            d = <Date>date;
        } else {
            d.setTime(d.getTime() + (<number>date * 24 * 60 * 60 * 1000));
        }
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    checkSetting() {
        this.setCookie("Bearer", "", 0);
    }
    Clear_Local_Storage() {
        window.localStorage.clear();
    }
    set_localstorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    get_localstorage(key) {
        let value = localStorage.getItem(key);
        return JSON.parse(value);
    }
    get_cached_column(key, gridfilter: Array<GridFilter>) {
        let cols = this.get_localstorage(key);
        if (cols) {
            gridfilter.map(d => {
                let item = cols.find(x => x.col == d.ColumnName);
                if (item) { d.Is_Visible = item.show; }
            });
        }
    }
}

enum StatusType {
    Open = "Open",
    Closed = "Closed",
    OnHold = "OnHold"
}
enum Storage_Key {
    DB_Announcement = "DB_Announcement"
}