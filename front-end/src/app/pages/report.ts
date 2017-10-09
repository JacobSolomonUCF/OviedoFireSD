import {Component} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Reports</h1>
    </div>

    <div class="content">
      <item-table [heading]="heading" [rows]="reports" [viewType]="'view'" [dataType]="'reports'"></item-table>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class Report {
  headingDaily = [
    {prop: 'Compartment',   dragable: false, resizeable: false},
    {prop: 'Item',  dragable: false, resizeable: false},
    {prop: 'Sun',   dragable: false, resizeable: false},
    {prop: 'Mon',   dragable: false, resizeable: false},
    {prop: 'Tues',  dragable: false, resizeable: false},
    {prop: 'Wed',   dragable: false, resizeable: false},
    {prop: 'Thur',  dragable: false, resizeable: false},
    {prop: 'Fri',   dragable: false, resizeable: false},
    {prop: 'Sat',   dragable: false, resizeable: false}
  ];
  headingWeekly = [
    {prop: 'Compartment', dragable: false, resizeable: false},
    {prop: 'Item', dragable: false, resizeable: false},
    {prop: 'Status', dragable: false, resizeable: false}
  ];
  //['Name','Schedule','Status','ID'];
  reports: any[] = [
    {
      Name: "ATV 46 Checklist test", Schedule: "Daily", Status: "Complete", ID: '10012',
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
      Name: "ATV 46 Checklist", Schedule: "Daily", Status: "Complete", ID: '10012',
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
      Name: "ATV 46 Checklist", Schedule: "Daily", Status: "Complete", ID: '10012',
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
      Name: "Engine 44 Checklist", Schedule: "Daily", Status: "Complete", ID: '10014',
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
      Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015',
      data: {
        heading: this.headingWeekly,
        rows: [
          {Compartment: "Driver #1", Item: "Horn", Status: 'Okay'},
          {Compartment: "Driver #1", Item: "Lights", Status: '    '},
          {Compartment: "Driver #1", Item: "Bells", Status: 'Okay'},
          {Compartment: "Driver #1", Item: "Horn", Status: '    '},
          {Compartment: "Driver #1", Item: "Lights", Status: 'Okay'},
          {Compartment: "Driver #1", Item: "Bells", Status: 'Broken'},
          {Compartment: "Driver #1", Item: "Horn", Status: '    '},
          {Compartment: "Driver #1", Item: "Lights", Status: 'Okay'},
          {Compartment: "Driver #1", Item: "Bells", Status: 'Okay'},
          {Compartment: "Driver #2", Item: "Map", Status: 'Okay'},
          {Compartment: "Driver #2", Item: "Radios", Status: ''},
          {Compartment: "Driver #2", Item: "Radios", Status: 'Okay'},
          {Compartment: "Driver #2", Item: "Radios", Status: 'Okay'}
        ]
      }
    }
  ];
  heading: any[] = [
    {prop: 'Name', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'Schedule', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'Status', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'ID', flexGrow: 1, dragable: false, resizeable: false}];

  constructor(webService: WebService) {
    webService.setState('reports');
  }
}
