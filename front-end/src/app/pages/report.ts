import {Component} from "@angular/core";

@Component({
  template: `
    <div class="header">
      <h1>Reports</h1>
    </div>

    <div class="content">
      <item-table [heading]="heading" [rows]="reports" [tableType]="'view'"></item-table>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class Report {
  heading: any[] = ['Name','Schedule','Status','ID'];
  reports: any[] = [
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012',
      data: {
        heading: ['Compartment','Item','Sun','Mon','Tues','Wed','Thur','Fri','Sat'],
        rows: [
          {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #2",    Item: "Map",    Sun: "Okay",    Mon: 'Repair', Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'}
        ]
      }
    },
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014',
      data: {
        heading: ['Compartment','Item','Sun','Mon','Tues','Wed','Thur','Fri','Sat'],
        rows: [
          {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #2",    Item: "Map",    Sun: "Okay",    Mon: 'Repair', Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
          {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'}
        ]
      }
    },
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015',
      data: {
        heading: ['Compartment','Item','Status'],
        rows: [
          {Compartment: "Driver #1",    Item: "Horn",   Status: 'Okay'  },
          {Compartment: "Driver #1",    Item: "Lights", Status: '    '  },
          {Compartment: "Driver #1",    Item: "Bells",  Status: 'Okay'  },
          {Compartment: "Driver #1",    Item: "Horn",   Status: '    '  },
          {Compartment: "Driver #1",    Item: "Lights", Status: 'Okay'  },
          {Compartment: "Driver #1",    Item: "Bells",  Status: 'Broken'},
          {Compartment: "Driver #1",    Item: "Horn",   Status: '    '  },
          {Compartment: "Driver #1",    Item: "Lights", Status: 'Okay'  },
          {Compartment: "Driver #1",    Item: "Bells",  Status: 'Okay'  },
          {Compartment: "Driver #2",    Item: "Map",    Status: 'Okay'  },
          {Compartment: "Driver #2",    Item: "Radios", Status: ''      },
          {Compartment: "Driver #2",    Item: "Radios", Status: 'Okay'  },
          {Compartment: "Driver #2",    Item: "Radios", Status: 'Okay'  }
        ]
      }
    }
  ];
}
