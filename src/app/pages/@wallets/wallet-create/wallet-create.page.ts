import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import {  WalletService} from '../../../providers/wallet.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.page.html',
  styleUrls: ['./wallet-create.page.scss'],
})
export class WalletCreatePage implements OnInit {
  formWallets: FormGroup;
  checkbox: boolean;
  constructor(
    public formBuilder: FormBuilder,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.createForm();
    // this.checkbox = false;
  }

    
  createForm() {
    this.formWallets = this.formBuilder.group({
      // img1: [''],
      // img2: [''],
      // img3: [''],
      // img4: [''],
      walletname: ['', Validators.required],
      checkbox: [false],
      privateKey: [''],
    });
  }


  onSubmit(form) {

    this.storage.get('pin').then((val) => {
      const pin = val;
      const password = WalletService.createPassword(pin);
      if ( form.checkbox === true ) {
        console.log('qaqui form ', form.privateKey)
        if ( form.privateKey !== '' || form.privateKey !== null ||  form.privateKey !== undefined) {
          console.log('.....................vacio');
          const decrip = WalletService.decryptPrivateKey(password, '6250f592f723fc61f914b2da4ccd2912b72ee74dec86769f76b0bfc506c98bd1477e015f27491a325259b9de208262d9', '0C07B4B25A335020F27A9C5D3A95E751');
          // console.log('.....................encryptedKey', decrip);
          const walletPrivatekey = WalletService.createAccountFromPrivateKey(form.walletname, password, decrip, environment.network);
          // console.log('.....................', walletPrivatekey);
          const walletGenerate = [{
            name: walletPrivatekey.name,
            schema: walletPrivatekey.schema,
            address: walletPrivatekey.address['address'],
            encryptedKey: walletPrivatekey.encryptedPrivateKey['encryptedKey'],
            iv: walletPrivatekey.encryptedPrivateKey['iv']
          }];
          // this.storage.get('wallets').then((wallet) => {
          //   if( wallet === null ) {
          //     console.log('........... sin push unique' );
          //     this.storage.set('wallets', walletGenerate);
          //   } else {
          //     const walletGenerate1 = {
          //       name: walletPrivatekey.name,
          //       schema: walletPrivatekey.schema,
          //       address: walletPrivatekey.address['address'],
          //       encryptedKey: walletPrivatekey.encryptedPrivateKey['encryptedKey'],
          //       iv: walletPrivatekey.encryptedPrivateKey['iv']
          //     };
          //     console.log('...........push' );
          //     wallet.push(walletGenerate1);
          //     this.storage.set('wallets', wallet);
          //   }
           
          // });
          
          this.formWallets.reset();
        
        } else {
          console.log('.....................errrrorrrrrr');
        }
       
        // console.log('se llama la funcion inportar cuenta', form.privateKey);
      } else {
        const walletSimple = WalletService.createSimpleWallet(form.walletname, password, environment.network);
        // console.log('..............walletSimple addres.', walletSimple.address['address']);

        const walletGenerayte = [{
          name: walletSimple.name,
          schema: walletSimple.schema,
          address: walletSimple.address['address'],
          encryptedKey: walletSimple.encryptedPrivateKey['encryptedKey'],
          iv: walletSimple.encryptedPrivateKey['iv']
        }];
        // console.log('....................walletSimple convertida.', walletGenerayte);
        this.storage.get('wallets').then((wallet) => {
          console.log('retona', wallet);
          // JSON.parse(wallet);
          if( wallet === null ) {
            console.log('........... sin push unique' );
            this.storage.set('wallets', walletGenerayte);
          } else {
            const walletGenerayte1 = {
              name: walletSimple.name,
              schema: walletSimple.schema,
              address: walletSimple.address['address'],
              encryptedKey: walletSimple.encryptedPrivateKey['encryptedKey'],
              iv: walletSimple.encryptedPrivateKey['iv']
            };
            console.log('...........push' );
            wallet.push(walletGenerayte1);
            this.storage.set('wallets', wallet);
          }
         
        });

        // this.selectWallet();
        // const encryptedKey = walletSimple['encryptedPrivateKey'].encryptedKey;
        // const iv = walletSimple['encryptedPrivateKey'].iv;
        // console.log('.....................encryptedKey', encryptedKey);
        // console.log('.....................encryptedKey', iv);
        
        this.formWallets.reset({});
        console.log('se crea la cuenta nueva');
      }
    });
  }

  updateCucumber(e) {
    
    this.checkbox = !this.checkbox;
    console.log('eeeeeeeeee', this.checkbox);
    if ( this.checkbox === false ) {
      console.log('limpieza');
    }
  }
}
