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

  private doesContactExist(contact) {
    return this.getAll().then(contacts => {
      const CONTACT_INDEX = findIndex(contacts, contact);
      let result = false;

      if (CONTACT_INDEX >= 0 && contacts.length >= 0) {
        result = true;
      }

      return result;
    });
  }

  getAll() {
    return this.storage.get('contacts').then(contacts => {
      return contacts || [];
    });
  }

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

  push(contact) {
    return this.doesContactExist(contact).then(doesContactExist => {
      return this.getAll().then(contacts => {
        contacts.push({ id: uniqid.time(), ...contact });

        return this.storage.set('contacts', contacts);
      });
    });
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

  remove(id) {
    return this.getAll().then(contacts => {
      const CONTACT_INDEX = findIndex(contacts, { id: id });
      contacts.splice(CONTACT_INDEX, 1);

      return this.storage.set('contacts', contacts);
    });
  }
}
