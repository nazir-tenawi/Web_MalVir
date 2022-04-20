import { Component, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { SystemService } from '../shared/SystemService';
import { GridFilter, KeyValue, KeyValueString, History_Model } from '../shared/common_model';
import { ModalDialog } from '../shared/modal.dialog';
import { history_commongrid_Component } from '../shared/grid/history_commongrid';

import { Row_ViewComponent } from '../scan/row_view';
import { AlertType } from '../shared/common_model';
declare var $: JQueryStatic;


@Component({
    moduleId: module.id,
    templateUrl: './history_list.html'
})

export class History_ListComponent {
    isLoading = false; sub: any; allItems_main: Array<History_Model> = []; allItems: Array<History_Model> = []; txtSearch = "";
    totalitems: number; gridFilter: Array<GridFilter> = [];
    AgentList: Array<any> = []; selectedAgent: number = 0;
    @ViewChild(Row_ViewComponent) public Row_View: Row_ViewComponent;
    @ViewChild('commongrid') commongrid: history_commongrid_Component;
    constructor(public fb: FormBuilder, public service: SystemService, public route: ActivatedRoute, public router: Router, public location: Location) {
        this.service.GoTo_ScrollTop(window);

        this.gridFilter.push(<GridFilter>{ DisplayText: "lblHistoryID", ColumnName: "HistoryID", Condition: "no", Type: "string", Value: "", Is_Visible: true });
        this.gridFilter.push(<GridFilter>{ DisplayText: "lblHashContent", ColumnName: "HashContent", Condition: "no", Type: "string", Value: "", Is_Visible: true });
        this.gridFilter.push(<GridFilter>{ DisplayText: "lblScanType", ColumnName: "ScanTypeName", Condition: "no", Type: "string", Value: "", Is_Visible: true });
        this.gridFilter.push(<GridFilter>{ DisplayText: "lblCreatedBy", ColumnName: "CreatedUserName", Condition: "no", Type: "string", Value: "", Is_Visible: true });
        this.gridFilter.push(<GridFilter>{ DisplayText: "lblHashID", ColumnName: "HashID", Condition: "no", Type: "string", Value: "", Is_Visible: false });
        this.gridFilter.push(<GridFilter>{ DisplayText: "lblCreatedDate", ColumnName: "CreatedDate", Condition: "no", Type: "datetime", Value: "", Is_Visible: true, Width: 11 });
        this.gridFilter.push(<GridFilter>{ DisplayText: "lblHashContent", ColumnName: "HashContent", Condition: "no", Type: "string", Value: "", Is_Visible: true, Width: 11 });

        //get-set last remembered columns
        this.service.App.get_cached_column('history_colums', this.gridFilter);

  

    }
    ngOnInit() {
        this.bindData();
    }
    ngAfterViewInit() { }
    ngOnDestroy() { if (this.sub) { this.sub.unsubscribe(); } }

    async bindData(isRefresh = false) {
        try {
            this.isLoading = true;
            let account = this.service.Account;
            let res = await this.service.Data.ExecuteAPI_Post<Array<History_Model>>("History/Get_History_List", { Is_Agent: account.Is_Agent, Is_Client: account.Is_Client });
            console.log("🚀 ~ file: history_list.ts ~ line 59 ~ History_ListComponent ~ bindData ~ res", res)
            if (res) {
                this.allItems_main = this.allItems = res;
                this.totalitems = res.length;
            }
            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
        }
    }
    pageChanged(obj: any) { this.bindToolTip(); }


    bindToolTip() {
        let service = this.service;
        window.setTimeout(() => {
            $(".subtooltip").each(function () {
                var $this = $(this);
                let obj: any = $this.find('#ID').val();
                let strSplit = obj.split("|"); //ID|Hash|Category|Status
                let site_url = service.Settings.API_URL + "/Home/Get_Tooltip?ModuleType=history&lang=" + service.CL + "&ID=" + strSplit[0] + "&Hash=" + strSplit[1] + "&Category=" + strSplit[2] + "&Status=" + strSplit[3];
                $(this)["webuiPopover"]({
                    container: $this,
                    placement: service.Is_RTL() ? 'left' : 'right',
                    animation: 'fade',
                    type: 'async',
                    url: site_url,
                    async: { type: 'POST', before: function (that, xhr) { xhr.setRequestHeader("Authorization", 'Bearer ' + service.Data.BearerToken); } },
                    cache: true,
                    width: 600,
                    height: 'auto',
                    trigger: 'hover',
                    delay: {
                        show: 400,
                        hide: 100
                    },
                    closeable: false,
                    offsetTop: 0,
                });
            });
        }, 300);
    }

    refreshGrid(isRefresh) {
        this.bindData(isRefresh);
    }

    change_columnchooser(filter: GridFilter, value, index) {
        filter.Is_Visible != value;
        let lst = this.gridFilter.map((d, index) => { return { col: d.ColumnName, show: d.Is_Visible, ind: index } });
        this.service.App.set_localstorage('history_colums', lst);
    }

    AddRow() {
        this.router.navigate(['/history/add']);
    }
    EditRow() {
        let selectedRow = this.allItems.filter((x) => x.selectedRow);
        if (selectedRow.length == 0) {
            this.service.showMessage(AlertType.Warning, this.service.Translator.instant("msgSelectRow"));
        }
        else if (selectedRow.length > 1) {
            this.service.showMessage(AlertType.Warning, this.service.Translator.instant("msgSelectOnlyOneRow"));
        }
        else {
            let ID = selectedRow[0]["DisplayHistoryID"];
            this.EditHistory(ID);
        }
    }
    EditRowDBClick(RowItem: any) {
        if (!RowItem.isTrusted && RowItem) {
            this.EditHistory(RowItem.DisplayHistoryID);
        }
    }
    EditHistory(DisplayHistoryID) {
        $(".subtooltip")["webuiPopover"]('destroy');
        this.router.navigate(["/history/detail", DisplayHistoryID]);//redirect to history detail page
    }
    async DeleteRow() {
        try {
            let selectedRow = this.allItems.filter((x) => x.selectedRow).map(d => d.HistoryID).join();
            if (selectedRow.length == 0) {
                this.service.showMessage(AlertType.Warning, this.service.Translator.instant("msgSelectRow"));
            } else {
                if (confirm(this.service.Translator.instant("msgDeleteSelectedItems"))) {
                    this.service.App.ShowLoader = true;
                    let res = await this.service.Data.ExecuteAPI_Post<number>("History/History_Delete", { HistoryIDs: selectedRow });
                    if (res > 0) {
                        this.service.showMessage(AlertType.Success, this.service.Translator.instant("msgHistoryDeleted"));
                        this.refreshGrid(true);
                    }
                    else {
                        this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgErrorHistoryUsedInAnotherTable"));
                    }
                    this.service.App.ShowLoader = false;
                }
            }
        }
        catch (e) {
            this.service.App.ShowLoader = false;
        }
    }

    ViewRow(RowItem: any) {
        if (RowItem) {
            this.Row_View.open(RowItem, "history");
        }
        else {
            let selectedRow = this.allItems.filter((x) => x.selectedRow);
            if (selectedRow.length == 0) {
                this.service.showMessage(AlertType.Warning, this.service.Translator.instant("msgSelectRow"));
            }
            else if (selectedRow.length > 1) {
                this.service.showMessage(AlertType.Warning, this.service.Translator.instant("msgSelectOnlyOneRow"));
            }
            else {
                this.Row_View.open(selectedRow[0], "history");
            }
        }
    }

    //Filter 
    FilterChange(value: string) {
        let filter_Items = []; let cDate = this.service.Date_Format(new Date(), 'yyyy-MM-dd');
        if (value == "") {
            filter_Items = this.allItems_main;
        }
        else if (value == "open") {
            // filter_Items = this.allItems_main.filter(d => (d.StatusType == "Open" || d.StatusType == "OnHold"));
        }
        else if (value == "closed") {
            // filter_Items = this.allItems_main.filter(d => d.StatusType == "Closed");
        }
        else if (value == "myupdated") {
            filter_Items = this.allItems_main.filter(d => d.UpdatedUser == this.service.Account.UserID);
        }
        this.allItems = filter_Items;
        this.service.App.refreshGrid.emit();
    }



    //ShowHideColumnFilter
    Is_ShowColumnFilter = true;
    ShowHideColumnFilter() {
        this.Is_ShowColumnFilter = !this.Is_ShowColumnFilter;
        this.service.App.showhideColumnFilter.emit(this.Is_ShowColumnFilter);
    }


    //Clear Checkbox
    ClearCheckbox() {
        this.service.App.clearAllCheckbox.emit();
    }

}
