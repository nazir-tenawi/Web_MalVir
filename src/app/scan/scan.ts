﻿import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SystemService } from "../shared/SystemService";
import { BaseChartDirective } from "ng2-charts";
import "chart.piecelabel.js";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { AlertType, Hash_Model } from "../shared/common_model";

@Component({
  moduleId: module.id,
  selector: "app",
  templateUrl: "./scan.html",
  styleUrls: ["./scan.scss"],
})
export class ScanComponent {
  SearchForm: FormGroup;
  FileForm: FormGroup;
  WiresharkForm: FormGroup;

  fileResult: Hash_Model = null;
  wiresharkResult: Hash_Model = null;
  searchResult : Hash_Model = null;

  fileName: string = "";

  IsSearch: boolean = true;
  IsWireshark: boolean = false;
  IsFile: boolean = false;

  IsSearchResult: boolean = false;
  IsWiresharkResult: boolean = false;
  IsFileResult: boolean = false;


  isLoading = false;
  sub: any;
  sub1: any;
  pieChartData: any;
  logoUrl = "/assets/images/logoLg.png";


  @ViewChild('f') form: NgForm;

  constructor(
    public service: SystemService,
    public router: Router,
    public fb: FormBuilder
  ) {
    this.service.GoTo_ScrollTop(window);
    this.InitForm();
  }
  
  ngOnInit() {}

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

  isLoading_chart = false;

  @ViewChild("OverviewChart") OverviewChart: BaseChartDirective;
  OverviewChartData: any;
  OverviewChartLabels: string[] = [];
  OverviewChartOptions: any = {};
  chart_colors = [];

  //Go To History
  GoToHistory(fltype) {
    if (fltype == "all") {
      this.router.navigate(["/history"]);
    } else {
      this.router.navigate(["/history"], { queryParams: { type: fltype } });
    }
  }

  ChangeMethod(type: string) {
    this.deleteFile(0);
    // this.form.resetForm();
    this.SearchForm.controls["HashContent"].setValue("");

    this.service.App.ShowLoader = false;

    this.IsSearch = false;
    this.IsWireshark = false;
    this.IsFile = false;
    this.IsSearchResult = false;
    this.IsWiresharkResult = false;
    this.IsFileResult = false;

    switch (type) {
      case "IsSearch":
        this.IsSearch = true;

        break;

        case "IsWireshark":
          this.IsWireshark = true;

          break;

          case "IsFile":
            this.IsFile = true;

            break;

            case "IsSearchResult":
              this.IsSearchResult = true;

              break;

              case "IsWiresharkResult":
                this.IsWiresharkResult = true;

                break;

                case "IsFileResult":
                  this.IsFileResult = true;
                  break;
    
      default:
        break;
    }


      }

  InitForm() {
    this.SearchForm = this.fb.group({
      HashContent: ["", Validators.required],
    });
    this.FileForm = this.fb.group({
      File: ["", Validators.required],
    });
    this.WiresharkForm = this.fb.group({
      Log: ["", Validators.required],
    });
  }

  async ScanSearch() {
    try {
      this.isLoading = true;

      let obj = this.SearchForm.getRawValue();
      console.log("🚀 ~ file: dashboard.ts ~ line 101 ~ ScanComponent ~ ScanSearch ~ obj", obj)
      // let obj2 = this.FileForm.getRawValue();
      // let obj3 = this.WiresharkForm.getRawValue();
      this.searchResult = await this.service.Data.ExecuteAPI_Post<any>("Scan/Scan_Search", obj);
      console.log("🚀 ~ file: dashboard.ts ~ line 93 ~ ScanComponent ~ ScanSearch ~ res", this.searchResult);
      if (this.searchResult) {

      // TODO: Display Result in unified result template

      
      }
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
    }
    this.ChangeMethod("IsSearchResult");
  }
  async ScanLogFile() {
    console.log("🚀ScanLogFile");

    console.log("🚀 ~ file: dashboard.ts ~ line 158 ~ ScanComponent ~ ScanLogFile ~ this.IsWiresharkResult", this.IsWiresharkResult)
    if(this.IsWireshark){

      console.log("🚀 ~ file: dashboard.ts ~ line 101 ~ ScanComponent ~ ScanWireshark ~ ScanWireshark", 'ScanWireshark')
      try {
        this.isLoading = true;
        let res = await this.service.Data.ExecuteAPI_Post<any>("Scan/Scan_Wireshark", {  attachment: this.lstAttachments ? this.lstAttachments[0] : [] });
        this.wiresharkResult = res;
        console.log("🚀 ~ file: dashboard.ts ~ line 132 ~ ScanComponent ~ ScanWireshark ~ res", res)
        
        if (res) {
        }
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
      }
      this.ChangeMethod("IsWiresharkResult");
    } else if (this.IsFile){

      console.log("🚀 ~ file: dashboard.ts ~ line 101 ~ ScanComponent ~ IsFileResult ~ IsFileResult", 'IsFileResult')
      try {
        this.isLoading = true;
        let res = await this.service.Data.ExecuteAPI_Post<any>("Scan/Scan_File", {  attachment: this.lstAttachments ? this.lstAttachments[0] : [] });
        this.fileResult = res;
        console.log("🚀 ~ file: dashboard.ts ~ line 132 ~ ScanComponent ~ IsFileResult ~ res", res)
        
        if (res) {
        }
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
      }
      this.ChangeMethod("IsFileResult");
    }
  }

      //Attachments
      @ViewChild('flAttachment') flAttachment: ElementRef;
      lstAttachments: Array<any> = [];
      Not_AllowedExtensions: Array<string> = [];
      fileChange(event: any) {
          console.log("🚀 ~ file: dashboard.ts ~ line 156 ~ ScanComponent ~ fileChange ~ event", event)
          // let files = event.target.files;// [].slice.call(event.target.files);
          let files = event;// [].slice.call(event.target.files);
          console.log("🚀 ~ file: dashboard.ts ~ line 157 ~ ScanComponent ~ fileChange ~ files", files)
          for (var i = 0; i < files.length; i++) {
              let file = files[i];
              this.ReadFiles(file); //read files                       
          }
      }
      ReadFiles(file) {
          var myReader: FileReader = new FileReader();
          console.log("🚀 ~ file: dashboard.ts ~ line 176 ~ ScanComponent ~ ReadFiles ~ myReader", myReader)
          let extension = file.name.replace(/^.*\./, '');
          this.fileName = file.name;
          if (this.Not_AllowedExtensions.indexOf(extension.toLowerCase()) < 0) {
              myReader.readAsDataURL(file);
              myReader.onloadend = async (e) => {
                  this.lstAttachments.push({ name: file.name, type: file.type, extension: extension, size: file.size, value: <string>myReader.result });
                  let obj = [];
                  let index = 0;
                  let res = {};

                      const progressInterval = setInterval(() => {
                        if (this.files[index].progress === 100) {
                          clearInterval(progressInterval);
                          this.ScanLogFile();
                          // this.uploadFilesSimulator(index + 1);
                        } else {
                          if(this.files[index].progress >= 95 && res == {}){
                          } else {
                            this.files[index].progress += 5;
                          }
                        }
                      }, 100);
     
              }
          }
          else {
              this.service.showMessage(AlertType.Error, this.service.Translator.instant("msgFileExtensionNotSupport"));
          }
      }
  
      RemoveAttachment(item: any, type: string) {
          this.lstAttachments = this.lstAttachments.filter(d => d != item);
      }


  files: any[] = [];

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
   prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.fileChange(files);
    console.log("🚀 ~ file: dashboard.ts ~ line 222 ~ ScanComponent ~ prepareFilesList ~ uploadFilesSimulator", 'uploadFilesSimulator')
    // this.uploadFilesSimulator(0);
  }
  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
            console.log("🚀 ~ file: dashboard.ts ~ line 221 ~ ScanComponent ~ prepareFilesList ~ uploadFilesSimulator", 'uploadFilesSimulator')
          }
        }, 200);
      }
    }, 1000);
  }



  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals = 0) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
