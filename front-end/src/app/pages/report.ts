import {Component} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Reports</h1>
    </div>

    <div class="content" [ngSwitch]="loading">
      <div *ngSwitchCase="true" class="centered">
        <i class="fa fa-5x fa-spinner fa-pulse"></i>
      </div>
      <div *ngSwitchCase="false">
        <item-table [heading]="heading" [rows]="reports" [viewType]="'view'" [dataType]="'reports'"></item-table>
      </div>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class Report {
  loading: boolean = true;
  headingDaily = [
    {prop: 'compartment',   dragable: false, resizeable: false},
    {prop: 'item',  dragable: false, resizeable: false},
    {prop: 'sunday', name: 'Sun',   dragable: false, resizeable: false},
    {prop: 'monday',   dragable: false, resizeable: false},
    {prop: 'tuesday',  dragable: false, resizeable: false},
    {prop: 'wednesday',   dragable: false, resizeable: false},
    {prop: 'thursday',  dragable: false, resizeable: false},
    {prop: 'friday',   dragable: false, resizeable: false},
    {prop: 'saturday',   dragable: false, resizeable: false}
  ];
  headingWeekly = [
    {prop: 'compartment', dragable: false, resizeable: false},
    {prop: 'item', dragable: false, resizeable: false},
    {prop: 'status', dragable: false, resizeable: false}
  ];
  constructor(webService: WebService) {
    let self = this;

    webService
      .setState('reports')
      .doGet('/reports')
      .subscribe((resp) => {
        self.reports = resp['reports'].map((r) => {
          if (r.status === 'Daily')
            r.data.heading = self.headingDaily;
          else
            r.data.heading = self.headingWeekly;
          return r;
        });
        self.loading = false;
      })
    ;
  }

  heading: any[] = [
    {prop: 'name', dragable: false, resizeable: false},
    {prop: 'schedule', dragable: false, resizeable: false},
    {prop: 'status', dragable: false, resizeable: false},
    {prop: 'id', dragable: false, resizeable: false}];

  //['name','schedule','status','id'];
  reports: any[];
  old: any[] = [
    {
      name: "ATV 46 Checklist test", schedule: "Daily", status: "Complete", id: '10012',
      data: {
        heading: this.headingDaily,
        rows: [
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Map",
            Sun: "Okay",
            Mon: 'Broken',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          }
        ]
      }
    },
    {
      name: "ATV 46 Checklist", schedule: "Daily", status: "Complete", id: '10012',
      data: {
        heading: this.headingDaily,
        rows: [
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Map",
            Sun: "Okay",
            Mon: 'Broken',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          }
        ]
      }
    },
    {
      name: "ATV 46 Checklist", schedule: "Daily", status: "Complete", id: '10012',
      data: {
        heading: this.headingDaily,
        rows: [
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Map",
            Sun: "Okay",
            Mon: 'Broken',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          }
        ]
      }
    },
    {
      name: "Engine 44 Checklist", schedule: "Daily", status: "Complete", id: '10014',
      data: {
        heading: this.headingDaily,
        rows: [
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Horn",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Broken',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Lights",
            Sun: "Broken",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #1",
            Item: "Bells",
            Sun: "Missing",
            Mon: 'Okay',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Map",
            Sun: "Okay",
            Mon: 'Broken',
            Tues: 'Okay',
            Wed: 'Broken',
            Thur: 'Okay',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          },
          {
            Compartment: "Driver #2",
            Item: "Radios",
            Sun: "Okay",
            Mon: 'Okay',
            Tues: 'Broken',
            Wed: 'Broken',
            Thur: 'Broken',
            Fri: 'Okay',
            Sat: 'Okay'
          }
        ]
      }
    },
    {
      name: "Engine 46 Checklist", schedule: "Weekly", status: "Not Complete", id: '10015',
      data: {
        heading: this.headingWeekly,
        rows: [
          {Compartment: "Driver #1", Item: "Horn", status: 'Okay'},
          {Compartment: "Driver #1", Item: "Lights", status: '    '},
          {Compartment: "Driver #1", Item: "Bells", status: 'Okay'},
          {Compartment: "Driver #1", Item: "Horn", status: '    '},
          {Compartment: "Driver #1", Item: "Lights", status: 'Okay'},
          {Compartment: "Driver #1", Item: "Bells", status: 'Broken'},
          {Compartment: "Driver #1", Item: "Horn", status: '    '},
          {Compartment: "Driver #1", Item: "Lights", status: 'Okay'},
          {Compartment: "Driver #1", Item: "Bells", status: 'Okay'},
          {Compartment: "Driver #2", Item: "Map", status: 'Okay'},
          {Compartment: "Driver #2", Item: "Radios", status: ''},
          {Compartment: "Driver #2", Item: "Radios", status: 'Okay'},
          {Compartment: "Driver #2", Item: "Radios", status: 'Okay'}
        ]
      }
    }
  ];
}
