import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from '../../pages/users/users.component';
import { VehiclesComponent } from '../../pages/vehicles/vehicles.component';
import { BusPassRequestsComponent } from '../../pages/bus-pass-requests/bus-pass-requests.component';
import { BusStopsComponent } from '../../pages/bus-stops/bus-stops.component';
import { BusRoutesComponent } from '../../pages/bus-routes/bus-routes.component';
import { VehicleTypesComponent } from '../../pages/vehicle-types/vehicle-types.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FeedbackComponent } from '../../pages/feedback/feedback.component';


@NgModule({
  declarations: [
    UsersComponent,
    VehiclesComponent,
    BusPassRequestsComponent,
    BusStopsComponent,
    BusRoutesComponent,
    VehicleTypesComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class AdminLayoutModule { }
