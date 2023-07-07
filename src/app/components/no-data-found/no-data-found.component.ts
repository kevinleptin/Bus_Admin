import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.scss']
})
export class NoDataFoundComponent implements OnInit {
  @Input() title: any = "";
  @Input() message: any = "";
  constructor() { }

  ngOnInit(): void {
    // console.log(this.message);
  }

}
