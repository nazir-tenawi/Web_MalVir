export class KeyValue {
    public Key: string;
    public Value: number;
}
export class KeyValueDefault {
    public Key: string;
    public Value: number;
    public MainID: number;
}
export class KeyValueString {
    public Key: string;
    public Value: string;
}

export interface Hash_Model {
    HashID: number;
    Type: string;
    HashContent: string;
    Size: number;
    CreatedDate: Date;
    selectedRow?: boolean;
}
export class Account_Model {
    UserID: number;
    DisplayName: string;
    UserName: string;
    Email: string;
    ProfilePicture: string;
    Is_Agent_Original: boolean;
    Is_Agent: boolean;
    Is_Client: boolean;
    DefaultPassword: string;
    Is_Profile_Visible: boolean;
    Is_Profile_Visible_Client: boolean;
    Is_CommonSetting_Visible: boolean;
    Is_CommonSetting_Visible_Client: boolean;
    PageSize: number;
    PageSize_Client: number;

    //History
    Show_History_Menu: boolean;
    Is_Full_History: boolean;
    Is_View_History: boolean;
    Is_Edit_History: boolean;
    Is_Delete_History: boolean;

    Show_History_Menu_Client: boolean;
    Is_Full_History_Client: boolean;
    Is_View_History_Client: boolean;
    Is_Edit_History_Client: boolean;
    Is_Delete_History_Client: boolean;

    //Admin
    Show_Admin_Menu: boolean;
    Is_Full_Admin: boolean;
    Is_View_Admin: boolean;
    Is_Add_Admin: boolean;
    Is_Edit_Admin: boolean;
    Is_Delete_Admin: boolean;

    //Show Admin Dashboard
    Show_Admin_Dashboard: boolean;

    //extra
    Is_Show_ClientPortal_Link: boolean; //this will use for show client's pages or agent's pages


    //Page_Permission: Page_Permission;
    public init() {
        this.Show_History_Menu = this.Is_Full_History || this.Is_View_History  || this.Is_Edit_History || this.Is_Delete_History;
        this.Show_History_Menu_Client = this.Is_Full_History_Client || this.Is_View_History_Client || this.Is_Edit_History_Client || this.Is_Delete_History_Client;
        this.Show_Admin_Menu = this.Is_Full_Admin || this.Is_View_Admin || this.Is_Add_Admin || this.Is_Edit_Admin || this.Is_Delete_Admin;


        if (this.Is_Agent_Original) { this.Show_Admin_Dashboard = true; } else { this.Show_Admin_Dashboard = false; }
    }
    constructor(item: Account_Model) {
        Object.keys(item).forEach((d) => {
            this[d] = item[d];
        });
        this.init();
        //this.Page_Permission = new Page_Permission(item.Page_Permission);
    }
}

class Page_Permission {
    constructor(item: Page_Permission) {
        Object.keys(item).forEach((d) => {
            this[d] = item[d];
        });
        this.init();
    }
    public init() {

    }
}

export class Settings_Model {
    Base_API_URL: string;
    API_URL: string;
    Site_URL: string;
    Expiration_Time: number;
}

//Common Grid
export interface GridFilter {
    ColumnName: string;
    SortColumnName: string;
    DisplayText: string;
    Value: any;
    Condition: string;
    Type: string; // string|date|datetime|int|number|decimal|bool
    Is_Visible: boolean;
    Width: number;
    TextAlign: string;
    Is_Sum: boolean;
    Is_Price: boolean;
    Is_Sort: boolean;
    Is_EditLink: boolean;
    EditType: string;
    Actions: Array<Action_Type>;
    Is_TDClass: boolean;
}
export class Action_Type {
    class: string;
    text: string;
    font: string;
    type: string;
}

export class Pager {
    public totalItems: number;
    public currentPage: number;
    public pageSize: number;
    public totalPages: number;
    public startPage: number;
    public endPage: number;
    public startIndex: number;
    public endIndex: number;
    public pages: any;
}
export class Column_Detail {
    Display_Name: string;
    Property_Name: string;
    Width: number;
    Is_Visible: boolean;
    Is_Sortable: boolean;
    Type: string;
    Sort_Order: string;
}

//paging wise
export class Custom_Paging_Model {
    page: number;
    pageSize: number;
    sortColumn: string;
    sortOrder: string;
    search: string;
    where: string;
    Columns: Array<GridFilter> = [];
    isAll: number;
    isFooterRow: number;
    isTotal: number;

    StartDate: string; EndDate: string;
}

export enum GridEvent_Type {
    Page = 'page',
    Pagesize = 'pagesize',
    Sort = 'sort',
    Search = 'search',
    Refresh = 'refresh'
}
//Common Grid


//Start Alerts
export class Alert {
    type: AlertType;
    message: string;
    alertId: string;
    keepAfterRouteChange: boolean;
    cssClass: string;
    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}
//End Alerts

export class ApiResponse {
    isSuccess: boolean;
    msg: string;
    data: any;
}

//Menu Class
export class Menu_Model {
    Main_Menu_Class: string = "";
    Admin_Menu_Class: string = "";
    Is_Admin_Page: boolean = false;
}

export class UserManagement_Model {
    UserID: number;
    RoleID: number;
    RoleName: string;
    DisplayName: string;
    UserName: string;
    Password: string;
    Email: string;
    PhoneNo: string;
    TimeZoneID: number;
    Is_SendMail_Password: boolean;
    Description: string;
    ProfilePicture: string;
    ProfilePictureName: string;
    Is_Active: boolean;
    CreatedDate: Date;
    Is_Agent: boolean;
    Is_Client: boolean;

    selectedRow: boolean;
}


//History Model
export interface History_Model {
    HistoryID: number;
    DisplayHistoryID: string;
    Hash: string;
    ScanTypeID: number;
    HashID: number;
    HistoryModeID: number;
    CreatedUser: number;
    UpdatedUser: number;
    CreatedDate: Date;
    UpdatedDate: Date;
    IPAddress: string;
    ScanTypeName: string;
    CreatedUserName: string;
    selectedRow: boolean;
}



//Dashboard Model
export enum ModuleType {
    history = "history",
}