import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { Address } from 'nem-library';
import * as uniqid from 'uniqid';
import { WalletProvider } from '../wallet/wallet';
import { AlertProvider } from '../alert/alert';

/*
  Generated class for the ContactsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContactsProvider {
  constructor(
    private storage: Storage,
    private walletProvider: WalletProvider,
    private alertProvider: AlertProvider,
  ) {
    console.log('Hello CrudProvider Provider');
  }

  /**
   *
   *
   * @param {*} contact
   * @returns
   * @memberof ContactsProvider
   */
  doesContactExist(contact) {
    return this.getAll().then(contacts => {
      const exit = contacts.filter(contc => contc.address === contact.address)
      let result;
      if (exit.length > 0) {
        result = true;
      } else {
        result = false;
      }
      return result;
    });
  }

  /**
   *
   *
   * @returns
   * @memberof ContactsProvider
   */
  getAll() {
    return this.storage.get('contacts').then(contacts => {
      return contacts || [];
    });
  }

  /**
   *
   *
   * @param {*} contact
   * @returns
   * @memberof ContactsProvider
   */
  push(contact) {

    console.log('contactcontactcontact', contact);
    
    return this.doesContactExist(contact).then(doesContactExist => {
      if (!doesContactExist) {
        return this.getAll().then(contacts => {
          contacts.push({ id: uniqid.time(), ...contact });
          this.storage.set('contacts', contacts)
          return false;
        });
      } else {
        return true;
      }
    });
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof ContactsProvider
   */
  remove(id) {
    return this.getAll().then(contacts => {
      const CONTACT_INDEX = findIndex(contacts, { id: id });
      contacts.splice(CONTACT_INDEX, 1);
      return this.storage.set('contacts', contacts);
    });
  }

  //----------------------------------------------------------------------------------------

  search(rawAddress: string): Promise<string> {
    const ADDRESS = new Address(rawAddress);
    return Promise.all([this.walletProvider.getWallets(), this.getAll()]).then(
      results => {
        const wallets = results[0];
        const contacts = results[1];

        const WALLET = find(
          wallets,
          wlt => wlt.address.plain() === ADDRESS.plain()
        );
        const CONTACT = find(contacts, { address: ADDRESS.plain() });

        if (WALLET) {
          return WALLET.name;
        } else if (CONTACT) {
          return CONTACT.name;
        } else {
          return ADDRESS.pretty();
        }
      }
    );
  }


  update(id, contact) {
    return this.doesContactExist(contact).then(doesContactExist => {
      if (doesContactExist) {
        this.alertProvider.showMessage('Nothing is changed. Please try again.');
      } else {
        return this.getAll().then(contacts => {
          const CONTACT_INDEX = findIndex(contacts, { id: id });
          contacts[CONTACT_INDEX] = contact;

          return this.storage.set('contacts', contacts);
        });
      }
    });
  }


}
