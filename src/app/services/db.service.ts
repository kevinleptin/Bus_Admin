import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseUrls } from '../base-urls';

export class Response {
  code: any;
  message: any;
  data: any[] = [];
}
@Injectable({
  providedIn: 'root'
})
export class DbService {

  usersSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  driversSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  routesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  routeStopsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  vehiclesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  busPassesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  feedbacksSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  getUsers(userType: number = 0) {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.USER_GROUPURL}/get-users?type=${userType}`)
      .subscribe({
        next: (value: any) => {
          if(userType) {
            this.driversSubject.next(value)
          } else {
            this.usersSubject.next(value)
          }
        },
        error: (error) => console.error(error)
      });
  }

  getRoutes() {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.BUS_ROUTES_GROUPURL}/get-all`)
      .subscribe({
        next: (value: any) => {
          this.routesSubject.next(value);
        },
        error: (error) => console.error(error)
      });
  }

  getRouteStops(routeId: number) {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.ROUTE_STOPS_GROUPURL}/get-route-stops?routeId=${routeId}`)
      .subscribe({
        next: (value: any) => {
          this.routeStopsSubject.next(value);
        },
        error: (error) => console.error(error)
      });
  }

  getVehicles() {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.VEHICLES_GROUPURL}/get`)
      .subscribe({
        next: (value: any) => {
          this.vehiclesSubject.next(value);
        },
        error: (error) => console.error(error)
      });
  }

  getBusPasses() {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.BUS_PASS_GROUPURL}/get`)
      .subscribe({
        next: (value: any) => {
          this.busPassesSubject.next(value);
        },
        error: (error) => console.error(error)
      });
  }

  getFeedbacks() {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.FEEDBACK_GROUPURL}/get`)
      .subscribe({
        next: (value: any) => {
          this.feedbacksSubject.next(value);
        },
        error: (error) => console.error(error)
      });
  }
}
