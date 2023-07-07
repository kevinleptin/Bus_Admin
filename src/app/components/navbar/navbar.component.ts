import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  // { path: '/home', title: 'Home', icon: '', class: '' },
  { path: '/users', title: 'Users', icon: '', class: '' },
  { path: '/drivers', title: 'Drivers', icon: '', class: '' },
  { path: '/vehicles', title: 'Vehicles', icon: '', class: '' },
  { path: '/bus-routes', title: 'Bus Routes', icon: '', class: '' },
  { path: '/requests', title: 'Requests', icon: '', class: '' },
  { path: '/feedbacks', title: 'Feedback', icon: '', class: '' },
  // { path: '/categories', title: 'Categories', icon: '', class: '' },
  // { path: '/cars', title: 'Cars', icon:  '', class: '' },
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public listTitles: any[] = [];
  public isCollapsed: boolean = true;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
  }

}
