import { Component, ViewChild } from '@angular/core';
import { SystemService } from '../shared/SystemService';
import { ModalDialog } from '../shared/modal.dialog';

@Component({
    moduleId: module.id,
    selector: 'row-view',
    templateUrl: './row_view.html'
})

export class Row_ViewComponent {
    isLoading = false; AttachmentList: Array<any> = [];
    @ViewChild("modalRow") modalRow: ModalDialog;
    model: any; HeaderText: string = "";
    ModuleType: string; //history|solution|problem|change

    constructor(public service: SystemService) {
        this.service.GoTo_ScrollTop(window);
    }
    ngOnInit() {
    }

    async open(item: any, module: string) {
        this.ModuleType = module;
        this.model = item;
        let ID;
        if (this.ModuleType == "history") {
            ID = item.DisplayHistoryID;
            this.HeaderText = "lblViewHistory";
            this.AttachmentList = await this.service.Data.ExecuteAPI_Post<Array<any>>("History/Get_HistoryAttachment_ByID", { HistoryID: this.model.HistoryID });
        }
        this.modalRow.open();
    }
    extractData(res: Response) {
        return res.text() ? res.json() : "";
    }


}
