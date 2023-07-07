import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { BusPassRequestsComponent } from 'src/app/pages/bus-pass-requests/bus-pass-requests.component';
import { BusRoutesComponent } from 'src/app/pages/bus-routes/bus-routes.component';
import { BusStopsComponent } from 'src/app/pages/bus-stops/bus-stops.component';
import { FeedbackComponent } from 'src/app/pages/feedback/feedback.component';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { VehiclesComponent } from 'src/app/pages/vehicles/vehicles.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'drivers', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuard] },
  { path: 'bus-routes/:routeId/stops', component: BusStopsComponent, canActivate: [AuthGuard] },
  { path: 'bus-routes', component: BusRoutesComponent, canActivate: [AuthGuard] },
  { path: 'requests', component: BusPassRequestsComponent, canActivate: [AuthGuard] },
  { path: 'feedbacks', component: FeedbackComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
