import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-bus-stops',
  templateUrl: './bus-stops.component.html',
  styleUrls: ['./bus-stops.component.scss']
})
export class BusStopsComponent implements OnInit {
  isUpdate: boolean = false;
  isLoading: boolean = false;

  routeId!: number;

  routeStopsList: any[] = [];
  routeStopFormGroup!: FormGroup;
  adminId: number = JSON.parse(localStorage.getItem('user') ?? '{}').adminId ?? -1;

  constructor(
    private db: DbService,
    private fb: FormBuilder,
    private modal: NgbModal,
    private toast: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((res: any) => {
      this.routeId = +res.routeId;
      this.getData(res.routeId)
    })
  }

  getData(routeId: number) {
    this.db.getRouteStops(routeId);
    this.db.routeStopsSubject.subscribe((value) => {
      if(value.length !== 0) {
        this.routeStopsList = value
      }
    })
  }

  openUserModal(modalRef: TemplateRef<unknown>, route: any = null) {
    if(route === null) {
      this.isUpdate = false;
      this.routeStopFormGroup = this.fb.group({
        busStopId: [null],
        routeId: [this.routeId],
        stopName: ["", Validators.required],
        address: [""],
        isActive: [1],
        sequence: [this.routeStopsList.length + 1],
        adminId: [this.adminId]
      });
    } else {
      this.isUpdate = true;
      this.routeStopFormGroup = this.fb.group({
        busStopId: [route.busStopId],
        routeId: [route.routeId],
        stopName: [route.stopName, Validators.required],
        address: [route.address],
        isActive: [route.isActive],
        sequence: [route.sequence],
        adminId: [route.adminId]
      });
    }
    this.modal.open(modalRef)
  }

  saveStopsInDb() {
    let value = { ...this.routeStopFormGroup.value };
    if (value.sequence > this.routeStopsList.length && this.isUpdate) {
      this.toast.warning("Can't update, sequnence is greater than actual stops in route", "Warn")
      return;
    }

    let url = this.isUpdate ? BaseUrls.getUpdateUrl(BaseUrls.ROUTE_STOPS_GROUPURL) : BaseUrls.getAddUrl(BaseUrls.ROUTE_STOPS_GROUPURL);

    let formData = new FormData();
    Object.entries(value).forEach(([key, value]: [string, any]) => formData.append(key, value));

    this.http.post(url, formData)
    .subscribe({
      next: (value) => {
        if(!this.isUpdate) {
          // Update Total Stops
          let routeUrl = `${BaseUrls.BASE_HREF}/${BaseUrls.BUS_ROUTES_GROUPURL}/update-stops-counter?routeId=${this.routeId}`
          this.http.get(routeUrl).subscribe();
        }
        this.toast.success("Success");
        this.getData(this.routeId);
        this.modal.dismissAll();
      },
      error: (error) => {
        console.error(error)
        this.toast.error("Something went wrong!!")
      }
      
    });
  }

}
