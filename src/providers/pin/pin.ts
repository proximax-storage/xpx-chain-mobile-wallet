import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as BcryptJS from "bcryptjs";
import { ForgeProvider } from '../forge/forge';

/*
  Generated class for the PinProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PinProvider {

  constructor(http: HttpClient, private storage: Storage, private forge: ForgeProvider) {
    console.log('Hello PinProvider Provider');
  }

  get() {
    return new Promise((resolve, reject) => {
      this.storage.get("pin").then(pin => {
        resolve(pin);
      }).catch(error => {
        console.log("LOG: PinProvider -> get -> error", error);
        // reject(error);
      })
    });
  }

  set(pin) {
    const hashedPin = BcryptJS.hashSync(pin, 8)
    return new Promise((resolve, reject) => {
      this.storage.set("pin", hashedPin).then(pin => {
        resolve(pin);
      }).catch(error => {
        console.log("LOG: PinProvider -> set -> error", error);
        // reject(error);
      })
    });
  }

  hash(pin) {
    return BcryptJS.hashSync(pin, 8);
  }

  compare(currentPin) {
    return new Promise((resolve, reject) => {
      this.storage.get("pin").then(previousPin => {
        if (BcryptJS.compareSync(currentPin, previousPin)) {
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch(error => { });
    });
  }

  encryptPasswordUsingCurrentPin() {
    Promise.all([
      this.storage.get("currentPin"),
      this.storage.get("plainPassword"),
    ]).then(results => {
      const CURRENT_PIN = results[0];
      const PLAIN_PASSWORD = results[1];
      const SALT = this.forge.generateSalt();
      const IV = this.forge.generateIv();
      const ENCRYPTED_PASSWORD = this.forge.encrypt(PLAIN_PASSWORD, CURRENT_PIN, SALT, IV);

      Promise.all([
        this.storage.set("currentPin", null),
        this.storage.set("plainPassword", null),
        this.storage.set("encryptedPassword", { password: ENCRYPTED_PASSWORD, salt: SALT, iv: IV }),
      ]).then(res => {
        return res;
      })
    });
  }

  decryptPasswordUsingCurrentPin() {
    Promise.all([
      this.storage.get("currentPin"),
      this.storage.get("encryptedPassword"),
    ]).then(results => {
      const CURRENT_PIN = results[0];
      const ENCRYPTED_PASSWORD = results[1];
      console.log("LOG: PinProvider -> ecryptPasswordUsingCurrentPin -> ENCRYPTED_PASSWORD", ENCRYPTED_PASSWORD);

      const SALT = ENCRYPTED_PASSWORD.salt;
      const IV = ENCRYPTED_PASSWORD.iv;
      const PLAIN_PASSWORD = this.forge.decrypt(ENCRYPTED_PASSWORD.password, CURRENT_PIN, SALT, IV);

      Promise.all([
        this.storage.set("plainPassword", PLAIN_PASSWORD),
        this.storage.set("encryptedPassword", null),
      ]).then(res => {
        return res;
      })
    });
  }


  getCurrentPin() {
    return new Promise((resolve, reject) => {
      this.storage.get("currentPin").then(currentPin => {
        if (currentPin) {
          resolve(currentPin);
        } else {
          resolve(false);
        }

      }).catch(error => {
        console.log("LOG: PinProvider -> getCurrentPin -> error", error);
        // reject(error);
      })
    });

  }

  removeCurrentPin() {
    this.storage.set("currentPin", false).then(pin => {
      console.log(pin);
    }).catch(error => {
      console.log("LOG: PinProvider -> removeCurrentPin -> error", error);
      console.log(error);
    })
  }



  reset() {
    return new Promise((resolve, reject) => {
      this.storage.set("pin", false).then(pin => {
        this.removeCurrentPin();
        resolve(pin);
      }).catch(error => {
        console.log("LOG: PinProvider -> reset -> error", error);
        // reject(error);
      })
    });
  }

}
