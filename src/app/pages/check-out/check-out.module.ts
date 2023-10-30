import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckOutPageRoutingModule } from './check-out-routing.module';

import { CheckOutPage } from './check-out.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckOutPageRoutingModule,
    SharedModule
  ],
  declarations: [CheckOutPage]
})
export class CheckOutPageModule {}
