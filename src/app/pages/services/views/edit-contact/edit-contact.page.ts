import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/pages/auth/service/auth.service';
import { AddressBookService } from '../../service/address-book.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastProvider } from 'src/app/providers/toast/toast.provider';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.page.html',
  styleUrls: ['./edit-contact.page.scss'],
})

export class EditContactPage implements OnInit {
  formEditContact: FormGroup;
  alfaPattern = '^[a-zA-ZáéíóúÁÉÍÓÚ\\-\' ]+$';
  alfaNumberPattern = '^[a-zA-Z0-9\-\]+$';
  userTelegram = '^[a-zA-Z0-9@]+$';
  name: any;
  address: any;
  user: any;
  contactosStore: any;
  usertelegram: any;
  exists: any;

  constructor(
    public formBuilder: FormBuilder,
    public addressBookService: AddressBookService,
    private nav: NavController,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage,
    public authservice: AuthService,
    private toastProvider: ToastProvider
  ) { }

  ngOnInit() {
    this.name = this.addressBookService.contact.name;
    this.address = this.addressBookService.contact.address
    this.usertelegram = this.addressBookService.contact.usertelegram;
    this.user = this.authservice.user;
    this.createForm();
    this.getContactStore();
  }

  createForm() {
    this.formEditContact = this.formBuilder.group({
      name: [this.name, [Validators.required, Validators.pattern(this.alfaPattern), Validators.minLength(3), Validators.maxLength(30)]],
      address: [this.address, [Validators.required, Validators.pattern(this.alfaNumberPattern), Validators.minLength(40), Validators.maxLength(46)]],
      usertelegram: [this.usertelegram, [Validators.pattern(this.userTelegram), Validators.minLength(3), Validators.maxLength(10)]],
    });
  }

  scanAddress() {
    console.log('scan')
    this.barcodeScanner.scan().then(barcodeData => {
      const address = barcodeData.text
      this.formEditContact.patchValue({
        address: address
      })
    }).catch(err => {
      console.log('Error', err);
    });

  }
  getContactStore() {
    this.storage.get('contacts'.concat(this.user)).then(async (contact) => {
      this.contactosStore = contact.filter(element => element.address !== this.address)
      console.log('contactosStore', this.contactosStore)
    });
  }

  cancel() {
    this.nav.navigateRoot(`/address-book`);
  }

  onEdit(form) {
    if (this.formEditContact.valid) {
      if (this.contactosStore) {
        for (var i = 0; i < this.contactosStore.length; i++) {
          if (this.contactosStore[i].address === form.address) {
            this.exists = true;
            break;
          } else {
            this.exists = false;
          }
        }
          if (this.exists) {
            this.toastProvider.showToast('contact already exist. Please try again.')
          } else {
            this.contactosStore.push(form)
            this.storage.set('contacts'.concat(this.user), this.contactosStore)
            this.toastProvider.showToast('Successfully edited contact.')
            this.nav.navigateRoot(`/address-book`);
          }
        
      }
    }
  }
}
