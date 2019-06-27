import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/pages/auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressBookService {
  contact: any;
  show: any;
  constructor(
    private storage: Storage,
    public authservice: AuthService,
  ) { }

  use(data) {
    this.contact = data;
  }

  addContact(name: string, address: string, usertelegram: string) {
    const user = this.authservice.user
    return this.storage
      .get('contacts'.concat(user))
      .then(data => {
        const CONTACTS = data ? data : [];
        return CONTACTS;
      })
      .then((contacts: any[]) => {

        let foundContacts= contacts.filter( contact => {
          return contact.address.includes(address)
       });

       if(foundContacts.length > 0) {
        // duplicate account
       //  alert("Duplicate account");
       console.log("duplicate");
        return "duplicate"

      } else {
        const contact = {
          name: name,
          address: address.toUpperCase(),
          usertelegram: usertelegram
        };
        contacts.push(contact);
        return this.storage.set('contacts'.concat(user), contacts);
      }
      });
  }

}
