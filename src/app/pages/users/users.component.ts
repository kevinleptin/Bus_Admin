import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  isDriverUrl: boolean = false;
  isUpdate: boolean = false;
  isLoading: boolean = false;

  users: any[] = [];

  userFormGroup!: FormGroup;

  constructor(
    private router: Router,
    private db: DbService,
    private fb: FormBuilder,
    private modal: NgbModal,
    private toast: ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.isDriverUrl = this.router.url.replace("/", "") === "drivers";
    this.getData();
  }

  getData() {
    this.db.getUsers(+this.isDriverUrl);
    if(this.isDriverUrl) {
      // Fetch Drivers
      this.db.driversSubject.subscribe((value) => {
        if(value.length !== 0) {
          this.users = value
        }
      })
    } else {
      // Fetch Users
      this.db.usersSubject.subscribe((value) => {
        if(value.length !== 0) {
          this.users = value
        }
      })
    }
  }

  openUserModal(modalRef: TemplateRef<unknown>, user: any = null) {
    if(user === null) {
      this.isUpdate = false;
      this.userFormGroup = this.fb.group({
        userId: [null],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        name: [null, [Validators.required]],
        department: [null],
        isActive: [1],
        type: [+this.isDriverUrl] 
      });
    } else {
      this.isUpdate = true;
      this.userFormGroup = this.fb.group({
        userId: [user.userId],
        email: [user.email, [Validators.required, Validators.email]],
        password: [user.password, [Validators.required, Validators.minLength(6)]],
        name: [user.name, [Validators.required]],
        department: [user.department],
        isActive: [user.isActive],
        type: [user.type]
      });
    }
    this.modal.open(modalRef)
  }

  saveUser() {
    if(this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched();
      return
    }

    let value = { ...this.userFormGroup.value }
    let url = this.isUpdate ? BaseUrls.getUpdateUrl(BaseUrls.USER_GROUPURL) : BaseUrls.getAddUrl(BaseUrls.USER_GROUPURL);

    let formData = new FormData()
    Object.entries(value).forEach(([key, value]: [string, any]) => formData.append(key, value))
    this.http.post(url, formData).subscribe({
      next: (value) => {
        this.isLoading = false;
        this.toast.success(`${this.isDriverUrl ? 'Driver' : 'User'} ${this.isUpdate ? 'Updated' : 'Added'}`, 'Success');
        this.modal.dismissAll();
        this.getData();
      },
      error: (error: HttpErrorResponse) => {
        this.toast.warning(error.error.message);
        this.isLoading = false;
      }
    });
  }

}
