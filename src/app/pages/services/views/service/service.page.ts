import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {

  constructor(
    private nav: NavController,
  ) { }

  ngOnInit() {
  }

  addresBook() {
    this.nav.navigateRoot(['/address-book']);
  }

  supportMiltisig() {
    this.nav.navigateRoot(['/multisign-support']);
  }
}
