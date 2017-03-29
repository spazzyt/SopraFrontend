import { Component, OnInit } from '@angular/core';
import { DragulaService, DragulaModule } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-dragula-demo',
  templateUrl: 'dragula-demo.component.html',
  styleUrls: ['dragula-demo.component.css']
})



export class DragulaDemoComponent implements OnInit {

  public groups: Array<any> = [
    {
      name: 'Group A',
      items: [{name: 'Item A'},{name: 'Item B'},{name: 'Item C'},{name: 'Item D'}]
    },
    {
      name: 'Group B',
      items: [{name: 'Item 1'},{name: 'Item 2'},{name: 'Item 3'},{name: 'Item 4'}]
    }
  ];

  constructor() { }

  ngOnInit() {
  }
}





