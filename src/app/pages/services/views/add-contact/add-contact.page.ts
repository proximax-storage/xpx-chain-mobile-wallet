import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AddressBookService } from '../../service/address-book.service';
import { ToastProvider } from 'src/app/providers/toast/toast.provider';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
})
export class AddContactPage implements OnInit {
  formAddContact: FormGroup;
  alfaPattern = '^[a-zA-ZáéíóúÁÉÍÓÚ\\-\' ]+$';
  alfaNumberPattern = '^[a-zA-Z0-9\-\]+$';
  userTelegram = '^[a-zA-Z0-9@]+$';
  constructor(
    public formBuilder: FormBuilder,
    private nav: NavController,
    private barcodeScanner: BarcodeScanner,
    public addressBookService: AddressBookService,
    private toastProvider: ToastProvider

  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formAddContact = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(this.alfaPattern), Validators.minLength(3), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern), Validators.minLength(40), Validators.maxLength(46)]],
      usertelegram: ['', [Validators.pattern(this.userTelegram), Validators.minLength(3), Validators.maxLength(10)]],
    });
  }

  scanAddress() {
    this.barcodeScanner.scan().then(barcodeData => {
      const address = barcodeData.text
      this.formAddContact.patchValue({
        address: address
      })
    }).catch(err => {
      console.log('Error', err);
    });

  }

  cancel() {
    this.nav.navigateRoot(`/address-book`);
  }

  onAdd(form) {
    if (this.formAddContact.valid) {
      this.addressBookService.addContact(form.name, form.address, form.usertelegram)
        .then(status => {
          if(status === "duplicate") {
            this.toastProvider.showToast('contact already exist. Please try again.')
          } else {
          this.toastProvider.showToast('Successfully registered contact.')
          this.formAddContact.reset();
          this.nav.navigateRoot(`/address-book`);
          }
        });
    }
  }
}
