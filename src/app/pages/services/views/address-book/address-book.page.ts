import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/pages/auth/service/auth.service';
import { AddressBookService } from '../../service/address-book.service';


@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss'],
})
export class AddressBookPage implements OnInit {
  showcreate: boolean;
  showList: boolean;
  contacts: any;


  constructor(
    private nav: NavController,
    private storage: Storage,
    public authservice: AuthService,
    public adressBookService: AddressBookService
  ) { }

  ngOnInit() {
    this.listContact();
  }

  createContact() {
    this.nav.navigateRoot(`/add-contact`);
  }

  listContact() {
    const user = this.authservice.user;
    this.storage.get('contacts'.concat(user)).then(async (contact) => {
      if(contact) {
        this.contacts = contact
      } else {
        console.log('sin contact')
      }
  });
  }

  openContact(data) {
    console.log('edit contact', data)
    this.adressBookService.use(data)
    this.nav.navigateRoot(`/edit-contact`);
  }
}
