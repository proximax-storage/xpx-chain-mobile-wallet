import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import {  ProximaxProvider} from '../../../../providers/proximax.provider';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.page.html',
  styleUrls: ['./wallet-create.page.scss'],
})
export class WalletCreatePage implements OnInit {
  formWallets: FormGroup;
  checkbox: boolean;
  user: string;
  constructor(
    public formBuilder: FormBuilder,
    private storage: Storage,
    private provider: ProximaxProvider,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.createForm();
    // this.checkbox = false;
  }

  createForm() {
    this.formWallets = this.formBuilder.group({
      img1: [''],
      img2: [''],
      img3: [''],
      coloryelow: [''],
      walletname: ['', Validators.required],
      checkbox: [false],
      privateKey: [''],
    });
  }

  onSubmit(form) {
    console.log(form)
    this.user = this.authService.user;
    this.storage.get('pin').then((val) => {
      const pin = val;
      const password = this.provider.createPassword(pin);
      this.storage.get('wallets'.concat(this.user)).then((wallet) => {
      if ( form.checkbox === true ) {
        console.log('qaqui form ', form.privateKey);
        if ( form.privateKey !== '' || form.privateKey !== null ||  form.privateKey !== undefined) {
          console.log('.....................vacio');
          // const decrip = WalletService.decryptPrivateKey(password, form.privateKey, '0C07B4B25A335020F27A9C5D3A95E751');
          // console.log('.....................encryptedKey', decrip);
          // tslint:disable-next-line:max-line-length
          const walletPrivatekey = this.provider.createAccountFromPrivateKey(form.walletname, password, form.privateKey, environment.network);
          // console.log('.....................', walletPrivatekey);
          const walletGenerate = [{
            name: walletPrivatekey.name,
            schema: walletPrivatekey.schema,
            address: walletPrivatekey.address['address'].pretty(),
            encryptedKey: walletPrivatekey.encryptedPrivateKey['encryptedKey'],
            iv: walletPrivatekey.encryptedPrivateKey['iv']
          }];
            if( wallet === null ) {
              console.log('........... sin push unique' );
              this.storage.set('wallets'.concat(this.user), walletGenerate);

              
            } else {
              const walletGenerate1 = {
                name: walletPrivatekey.name,
                schema: walletPrivatekey.schema,
                address: walletPrivatekey.address['address'].pretty(),
                encryptedKey: walletPrivatekey.encryptedPrivateKey['encryptedKey'],
                iv: walletPrivatekey.encryptedPrivateKey['iv']
              };
              console.log('...........push' );
              wallet.push(walletGenerate1);
              this.storage.set('wallets'.concat(this.user), wallet);
            }
          this.formWallets.reset();
        } else {
          console.log('.....................errrrorrrrrr');
        }
      } else {
        const walletSimple = this.provider.createSimpleWallet(form.walletname, password, environment.network);
        const walletGenerayte = [{
          name: walletSimple.name,
          schema: walletSimple.schema,
          address: walletSimple.address['address'].pretty(),
          encryptedKey: walletSimple.encryptedPrivateKey['encryptedKey'],
          iv: walletSimple.encryptedPrivateKey['iv']
        }];
          console.log('retona', wallet);
          if( wallet === null ) {
            console.log('........... sin push unique' );
            this.storage.set('wallets'.concat(this.user), walletGenerayte);
          } else {
            const walletGenerayte1 = {
              name: walletSimple.name,
              schema: walletSimple.schema,
              address: walletSimple.address['address'].pretty(),
              encryptedKey: walletSimple.encryptedPrivateKey['encryptedKey'],
              iv: walletSimple.encryptedPrivateKey['iv']
            };
            console.log('...........push' );
            wallet.push(walletGenerayte1);
            
            this.storage.set('wallets'.concat(this.user), wallet);
          }
        this.formWallets.reset({});
        console.log('se crea la cuenta nueva');
      }
    });
    });
  }

  // onSubmit(form) {
  //   console.log(form)
  //   this.user = this.authService.user;
  //   this.storage.get('pin').then((val) => {
  //     const pin = val;
  //     const password = this.provider.createPassword(pin);
  //     if ( form.checkbox === true ) {
  //       console.log('qaqui form ', form.privateKey);
  //       if ( form.privateKey !== '' || form.privateKey !== null ||  form.privateKey !== undefined) {
  //         console.log('.....................vacio');
  //         // const decrip = WalletService.decryptPrivateKey(password, form.privateKey, '0C07B4B25A335020F27A9C5D3A95E751');
  //         // console.log('.....................encryptedKey', decrip);
  //         // tslint:disable-next-line:max-line-length
  //         const walletPrivatekey = this.provider.createAccountFromPrivateKey(form.walletname, password, form.privateKey, environment.network);
  //         // console.log('.....................', walletPrivatekey);
  //         const walletGenerate = [{
  //           name: walletPrivatekey.name,
  //           schema: walletPrivatekey.schema,
  //           address: walletPrivatekey.address['address'].pretty(),
  //           encryptedKey: walletPrivatekey.encryptedPrivateKey['encryptedKey'],
  //           iv: walletPrivatekey.encryptedPrivateKey['iv']
  //         }];
  //         this.storage.get('wallets'.concat(this.user)).then((wallet) => {
  //           if( wallet === null ) {
  //             console.log('........... sin push unique' );
  //             this.storage.set('wallets'.concat(this.user), walletGenerate);

              
  //           } else {
  //             const walletGenerate1 = {
  //               name: walletPrivatekey.name,
  //               schema: walletPrivatekey.schema,
  //               address: walletPrivatekey.address['address'],
  //               encryptedKey: walletPrivatekey.encryptedPrivateKey['encryptedKey'],
  //               iv: walletPrivatekey.encryptedPrivateKey['iv']
  //             };
  //             console.log('...........push' );
  //             wallet.push(walletGenerate1);
  //             this.storage.set('wallets'.concat(this.user), wallet);
  //           }
  //         });
  //         this.formWallets.reset();
  //       } else {
  //         console.log('.....................errrrorrrrrr');
  //       }
  //     } else {
  //       const walletSimple = this.provider.createSimpleWallet(form.walletname, password, environment.network);
  //       const walletGenerayte = [{
  //         name: walletSimple.name,
  //         schema: walletSimple.schema,
  //         address: walletSimple.address['address'],
  //         encryptedKey: walletSimple.encryptedPrivateKey['encryptedKey'],
  //         iv: walletSimple.encryptedPrivateKey['iv']
  //       }];
  //       this.storage.get('wallets'.concat(this.user)).then((wallet) => {
  //         console.log('retona', wallet);
  //         if( wallet === null ) {
  //           console.log('........... sin push unique' );
  //           this.storage.set('wallets'.concat(this.user), walletGenerayte);
  //         } else {
  //           const walletGenerayte1 = {
  //             name: walletSimple.name,
  //             schema: walletSimple.schema,
  //             address: walletSimple.address['address'],
  //             encryptedKey: walletSimple.encryptedPrivateKey['encryptedKey'],
  //             iv: walletSimple.encryptedPrivateKey['iv']
  //           };
  //           console.log('...........push' );
  //           wallet.push(walletGenerayte1);
            
  //           this.storage.set('wallets'.concat(this.user), wallet);
  //         }
  //       });

  //       // this.selectWallet();
  //       // const encryptedKey = walletSimple['encryptedPrivateKey'].encryptedKey;
  //       // const iv = walletSimple['encryptedPrivateKey'].iv;
  //       // console.log('.....................encryptedKey', encryptedKey);
  //       // console.log('.....................encryptedKey', iv);
  //       this.formWallets.reset({});
  //       console.log('se crea la cuenta nueva');
  //     }
  //   });
  // }

  updateCucumber(e) {
    this.checkbox = !this.checkbox;
    console.log('eeeeeeeeee', this.checkbox);
    if ( this.checkbox === false ) {
      console.log('limpieza');
    }
  }
}
