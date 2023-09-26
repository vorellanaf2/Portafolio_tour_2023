import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TabsPage } from 'src/app/tabs/tabs.page';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
})
export class CheckInPage implements OnInit {

  constructor() { }
   

  ngOnInit() {
  }

}
export const CheckInTabs = [
  CheckInPage,
  TabsPage
]
