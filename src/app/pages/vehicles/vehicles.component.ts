import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  isUpdate: boolean = false;
  isLoading: boolean = false;

  driverList: any[] = [];
  routesList: any[] = [];

  vehicleTypes: string[] = ["Mini Bus", "Shuttle Bus", "Coach Bus", "Hybrid Bus", "Single-Decker Bus", "Double-Decker Bus",];
  vehiclesList: any[] = [];
  vehicleFormGroup!: FormGroup;

  adminId: number = JSON.parse(localStorage.getItem('user') ?? '{}').adminId ?? -1;

  constructor(
    private db: DbService,
    private fb: FormBuilder,
    private modal: NgbModal,
    private toast: ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getSupportingData();
    this.getData();
  }

  getSupportingData() {
    this.db.getUsers(1);
    let driverSub = this.db.driversSubject.subscribe((value) => {
      if (value.length !== 0) {
        this.driverList = [...value];
        setTimeout(() => driverSub.unsubscribe(), 1000);
      }
    })

    this.db.getRoutes();
    let routeSub = this.db.routesSubject.subscribe((value) => {
      if (value.length !== 0) {
        this.routesList = [...value];
        setTimeout(() => routeSub.unsubscribe(), 1000);
      }
    })
  }

  getObject(key: string, value: any) {
    if(key === "driverId") return this.driverList.find(x => x.userId === value)
    if(key === "busRouteId") return this.routesList.find(x => x.routeId === value)
    return {};
  }

  getData() {
    this.db.getVehicles();
    let vehicleSub = this.db.vehiclesSubject.subscribe((value) => {
      if (value.length !== 0) {
        this.vehiclesList = [...value];
        setTimeout(() => vehicleSub.unsubscribe(), 1000);
      }
    })

  }

  openVehicleModal(modalRef: TemplateRef<unknown>, vehicle: any = null) {
    if (vehicle === null) {
      this.isUpdate = false;
      this.vehicleFormGroup = this.fb.group({
        vehicleId: [null],
        registrationNumber: [null, Validators.required],
        tripStartTime: [null],
        type: [null, Validators.required],
        tripEndTime: [null],
        totalSeats: [0, [Validators.required, Validators.min(1)]],
        filledSeats: [0],
        isActiveOnRoad: [1],
        driverId: [null, Validators.required],
        busRouteId: [null, Validators.required],
        pricePerSeat: [0, Validators.required],
        adminId: [this.adminId]
      });
    } else {
      this.isUpdate = true;
      this.vehicleFormGroup = this.fb.group({
        vehicleId: [vehicle.vehicleId],
        registrationNumber: [vehicle.registrationNumber, Validators.required],
        tripStartTime: [vehicle.tripStartTime],
        type: [vehicle.type, Validators.required],
        tripEndTime: [vehicle.tripEndTime],
        totalSeats: [vehicle.totalSeats, [Validators.required, Validators.min(1)]],
        filledSeats: [vehicle.filledSeats],
        driverId: [vehicle.driverId, Validators.required],
        busRouteId: [vehicle.busRouteId, Validators.required],
        isActiveOnRoad: [vehicle.isActiveOnRoad],
        pricePerSeat: [vehicle.pricePerSeat ?? 0, [Validators.required, Validators.min(1)]],
        adminId: [vehicle.adminId]
      });
    }
    this.modal.open(modalRef)
  }

  saveVehicleInDb() {
    if(this.vehicleFormGroup.invalid) {
      this.vehicleFormGroup.markAllAsTouched();
      return;
    }

    let values = { ...this.vehicleFormGroup.value };
    let url = this.isUpdate ? BaseUrls.getUpdateUrl(BaseUrls.VEHICLES_GROUPURL) : BaseUrls.getAddUrl(BaseUrls.VEHICLES_GROUPURL)
    
    let formData = new FormData();
    Object.entries(values).forEach(([key, value]: [string, any]) => formData.append(key, value));

    this.http.post(url, formData)
    .subscribe({
      next: (value) => {
        if(!this.isUpdate) {
          // Update Total Buses
          let routeUrl = `${BaseUrls.BASE_HREF}/${BaseUrls.BUS_ROUTES_GROUPURL}/update-buses-counter?routeId=${values.busRouteId}`
          this.http.get(routeUrl).subscribe();
        }
        this.toast.success("Success");
        this.getData();
        this.modal.dismissAll();
      },
      error: (error) => {
        console.error(error)
        this.toast.error("Something went wrong!!")
      }
      
    });
  }

}
