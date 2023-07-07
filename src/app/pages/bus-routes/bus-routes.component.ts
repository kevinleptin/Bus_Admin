import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-bus-routes',
  templateUrl: './bus-routes.component.html',
  styleUrls: ['./bus-routes.component.scss']
})
export class BusRoutesComponent implements OnInit {
  isUpdate: boolean = false;
  isLoading: boolean = false;

  routesList: any[] = [];
  routeFormGroup!: FormGroup;
  adminId: number = JSON.parse(localStorage.getItem('user') ?? '{}').adminId ?? -1;

  constructor(
    private db: DbService,
    private fb: FormBuilder,
    private modal: NgbModal,
    private toast: ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.db.getRoutes();
    this.db.routesSubject.subscribe((value) => {
      if(value.length !== 0) {
        this.routesList = value
      }
    })
  }

  openUserModal(modalRef: TemplateRef<unknown>, route: any = null) {
    if(route === null) {
      this.isUpdate = false;
      this.routeFormGroup = this.fb.group({
        routeId: [null],
        title: ["", Validators.required],
        description: [""],
        isActive: [1],
        adminId: [this.adminId]
      });
    } else {
      this.isUpdate = true;
      this.routeFormGroup = this.fb.group({
        routeId: [route.routeId],
        title: [route.title, Validators.required],
        description: [route.description],
        isActive: [route.isActive],
        adminId: [route.adminId]
      });
    }
    this.modal.open(modalRef)
  }

  saveVehicleInDb() {
    if(this.routeFormGroup.invalid) {
      this.routeFormGroup.markAllAsTouched();
      return
    }

    let value = { ...this.routeFormGroup.value }
    let url = this.isUpdate ? BaseUrls.getUpdateUrl(BaseUrls.BUS_ROUTES_GROUPURL) : BaseUrls.getAddUrl(BaseUrls.BUS_ROUTES_GROUPURL);

    let formData = new FormData()
    Object.entries(value).forEach(([key, value]: [string, any]) => formData.append(key, value))
    this.http.post(url, formData).subscribe({
      next: (value) => {
        this.isLoading = false;
        this.toast.success(`Bus Route ${this.isUpdate ? 'Updated' : 'Added'}`, 'Success');
        this.modal.dismissAll();
        this.getData();
      },
      error: (error: HttpErrorResponse) => {
        this.toast.warning(error.error.message);
        this.isLoading = false;
      }
    });
  }

  deleteRoute(routeId: number) {
    this.http.delete(`${BaseUrls.BASE_HREF}/${BaseUrls.BUS_ROUTES_GROUPURL}/delete?routeId=${routeId}`)
      .subscribe({
        next: (value) => {
          this.toast.success("Route Deleted Successfully")
        },
        error: (error) => {
          console.error(error)
          this.toast.error("Something went wrong!!")
        }
        
      });
  }

}
