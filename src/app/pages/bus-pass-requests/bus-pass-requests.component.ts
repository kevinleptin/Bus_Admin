import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-bus-pass-requests',
  templateUrl: './bus-pass-requests.component.html',
  styleUrls: ['./bus-pass-requests.component.scss']
})
export class BusPassRequestsComponent implements OnInit {

  isLoading: boolean = false;
  busPassesList: any[] = [];

  busPassReqFormGroup!: FormGroup;
  currentStatus!: number;

  showButtons: boolean = true;
  constructor(
    private fb: FormBuilder,
    private db: DbService,
    private modal: NgbModal,
    private toast: ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.db.getBusPasses();
    this.db.busPassesSubject.subscribe((value) => {
      if(value.length !== 0) {
        this.busPassesList = value
      }
    })
  }

  openModal(modalRef: TemplateRef<unknown>, req?: any) {
    this.currentStatus = req.status;
    this.showButtons = req.status >= 0;

    let obj: any = Object.entries(req).reduce((prev, [key, value]) => ({...prev, [key]: value}), {})
    if(req.status === -1) obj.status = 3; // Canceled
    if(req.status === -2) obj.status = 5; // Suspended

    this.busPassReqFormGroup = this.fb.group({ ...obj });
    this.modal.open(modalRef);
  }

  updateStatus() {
    let values = { ...this.busPassReqFormGroup.value }
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.BUS_PASS_GROUPURL}/update-status?busPassId=${values.busPassId}&status=${values.status}`)
      .subscribe((value: any) => {
        this.toast.success("Success");
        this.modal.dismissAll();
        this.getData();

        if(this.currentStatus === 1 && value['busPass']['status'] === 3) return;
        let isSub = !([3, 5].some(x => x === value['busPass']['status']))
        this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.VEHICLES_GROUPURL}/update-seat-counter?vehicleId=${values.vehicleId}&isAdd=${isSub}`).subscribe();
      }, (error) => {
        console.log(error);
        this.toast.error("Something went wrong!!")
      })
  }
}
