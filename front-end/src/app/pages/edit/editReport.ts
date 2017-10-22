import {Component} from "@angular/core";
import {WebService} from "../../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Reports</h1>
    </div>
    <div class="content" [ngSwitch]="loading">
      <div *ngSwitchCase="true" class="centered">
        <i class="fa fa-5x fa-spinner fa-pulse"></i>
      </div>
      <div *ngSwitchCase="false">
        <item-table #itemtable [heading]="heading" [rows]="reports" [viewType]="'view'" [dataType]="'report'">
          <div class="item-table-options-view table-options">
            <div class="left">
              <button class="add" (click)="itemtable.onclick()(undefined, itemtable.table)">
                <i class="fa fa-plus"></i> Add report
              </button>
            </div>
            <div class="right">
              <input
                #tableFilter
                class='filter'
                type='text'
                [ngModel]="filter"
                placeholder='Type to filter...'
                (keyup)='itemtable.updateFilter($event)'/>
            </div>
          </div>
          <div class="item-table-options-edit table-options">
            <button class="close" (click)="itemtable.toggle()()">
              <i class="fa fa-chevron-left"></i> Back
            </button>
          </div>
        </item-table>
      </div>
    </div>
  `
  , styleUrls: ['../../menu.sass']
})
export class EditReport {
  loading: boolean = true;
  heading: any[] = [
    {prop: 'name', flexGrow: 3, dragable: false, resizeable: true},
    {prop: 'schedule', flexGrow: 1, dragable: false, resizeable: true},
    // {prop: 'status', flexGrow: 1, dragable: false, resizeable: true},
    // {prop:'ID', flexGrow: 1, dragable: false, resizeable: true}
  ];
  reports: any[];

  constructor(public webService: WebService) {
    let self = this;

    webService.setState('eReport')
      .doGet('/listReports')
      .subscribe(resp => {
        self.reports = resp['list'].map(report => {
          if (report.interval.frequency === 'Daily')
            for (let i = 0, len = report.template.subSections.length; i < len; i++)
              if (report.template.subSections[i].title.indexOf(report.template.title) !== -1)
                report.template.subSections[i].title = report.template.subSections[i].title.substring(report.template.title.length + 3);
          return report
        });
        //   [
        //     {
        //       "id": "LAD1",
        //       "template": {
        //         "alert": "Clean all ladders before placing them back on the apparatus",
        //         "subSections": [
        //           {
        //             "inputElements": [
        //               {
        //                 "caption": "Present and Legible",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Heat Sensor (Color Change)",
        //                 "type": "pf"
        //               }
        //             ],
        //             "title": "Labels"
        //           },
        //           {
        //             "inputElements": [
        //               {
        //                 "caption": "Tight",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Cracks",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Deformation",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Punctures",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Worn Serrations",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Cracks in Welds",
        //                 "type": "pf"
        //               }
        //             ],
        //             "title": "Rungs"
        //           },
        //           {
        //             "inputElements": [
        //               {
        //                 "caption": "Cracks",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Gouges",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Deformation",
        //                 "type": "pf"
        //               }
        //             ],
        //             "title": "Beams"
        //           },
        //           {
        //             "inputElements": [
        //               {
        //                 "caption": "Excessive Wear",
        //                 "type": "pf"
        //               }
        //             ],
        //             "title": "Butt Spurs"
        //           },
        //           {
        //             "inputElements": [
        //               {
        //                 "caption": "Fraying",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Kinking",
        //                 "type": "pf"
        //               },
        //               {
        //                 "caption": "Snug (Wire Rope, If Applicable)",
        //                 "type": "pf"
        //               }
        //             ],
        //             "title": "Halyard"
        //           },
        //           {
        //             "inputElements": [
        //               {
        //                 "caption": "Operable",
        //                 "type": "pf"
        //               }
        //             ],
        //             "title": "Pawl Assembly"
        //           }
        //         ],
        //         "title": "Ladder #1 Inspection"
        //       },
        //       "interval": {
        //         "days": {
        //           "friday": false,
        //           "monday": false,
        //           "saturday": false,
        //           "sunday": false,
        //           "thursday": false,
        //           "tuesday": true,
        //           "wednesday": false
        //         },
        //         "frequency": "Monthly"
        //       }
        //     },
        //     {
        //       "id": "OXY1",
        //       "template": {
        //         "subSections": [
        //           {
        //             "inputElements": [
        //               {
        //                 "caption": "K Cylinder #1",
        //                 "type": "num"
        //               },
        //               {
        //                 "caption": "K Cylinder #2",
        //                 "type": "num"
        //               },
        //               {
        //                 "caption": "K Cylinder #3",
        //                 "type": "num"
        //               },
        //               {
        //                 "caption": "K Cylinder #4",
        //                 "type": "num"
        //               }
        //             ],
        //             "title": "Cascade Status"
        //           },
        //           {
        //             "inputElements": [
        //               {
        //                 "caption": "Number of K Cylinders Full",
        //                 "type": "num"
        //               },
        //               {
        //                 "caption": "Number of K Cylinders Empty",
        //                 "type": "num"
        //               },
        //               {
        //                 "caption": "Number of M Cylinders Full",
        //                 "type": "num"
        //               },
        //               {
        //                 "caption": "Number of M Cylinders Empty",
        //                 "type": "num"
        //               }
        //             ],
        //             "title": "Spare Cylinder Status"
        //           }
        //         ],
        //         "title": "Oxygen Levels #1"
        //       },
        //       "interval": {
        //         "days": {
        //           "friday": false,
        //           "monday": false,
        //           "saturday": false,
        //           "sunday": true,
        //           "thursday": false,
        //           "tuesday": false,
        //           "wednesday": false
        //         },
        //         "frequency": "Weekly"
        //       }
        //     }
        //   ];
        // // resp['reports'];
        console.log("Daily reports will be a bit wonky at the moment.");
        }, () => {
          self.loading = false;
        }, () => {
          self.loading = false;
        }
      );
  }
}
