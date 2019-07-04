import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import * as uniqid from 'uniqid';
import findIndex from 'lodash/findIndex';
/*
  Generated class for the ListStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ListStorageProvider {
  private listStorage = {};
  private listName = '';
  constructor(private storage: Storage) {
    console.log('Hello ListStorageProvider Provider');
  }

  init(listName) {
    this.listName = listName;
    this.listStorage[listName] = [];
  }

  getAll() {
    return this.storage.get(this.listName).then(list => {
      return list || [];
    });
  }

  push(item) {
    return this.getAll().then(list => {
      list.push({ id: uniqid.time(), ...item });

      return this.storage.set(this.listName, list);
    });
  }

  update(id, item) {
    return this.getAll().then(list => {
      const ITEM_INDEX = findIndex(list, { id: id });
      list[ITEM_INDEX] = item;

      return this.storage.set(this.listName, list);
    });
  }

  remove(id) {
    return this.getAll().then(list => {
      const ITEM_INDEX = findIndex(list, { id: id });
      list.splice(ITEM_INDEX, 1);

      return this.storage.set('list', list);
    });
  }
}
