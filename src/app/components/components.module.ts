import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NoDataFoundComponent } from './no-data-found/no-data-found.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NoDataFoundComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    NoDataFoundComponent
  ]
})
export class ComponentsModule { }
