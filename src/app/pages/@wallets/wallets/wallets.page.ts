import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  WalletService} from '../../../providers/wallet.service';

import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {
  formWallets: FormGroup;
  wallet: boolean;
  create: boolean;
  checkbox: boolean;
  private: boolean;
  constructor( 
    public formBuilder: FormBuilder
    ) { }

    check = [
      { val: '', isChecked: false }
    ];
  ngOnInit() {
    this.createForm();
    this.wallet = true;
    this.checkbox = false;
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

  createWallet(){
    this.wallet = false;
    this.create = true;
    console.log('create new wallet')
  }

  onSubmit(form) {

    const password = WalletService.CreatePassword('123456789')

    const wallet = WalletService.CreateSimpleWallet('wallet1', password, environment.network)

    console.log(".....................", wallet);
    
    console.log("aqui llegando", form)
    if(form.checkbox == true ){
      if(form.privateKey != '' || form.privateKey != null){
      
          this.wallet = true;
          this.create = false;
     
        this.formWallets.reset();
        console.log('se llama la funcion inportar cuenta', form.privateKey);
      }else{
        
        console.log('error putoo')
      }
      
    }else{
        this.wallet = true;
        this.create = false;
   
      this.formWallets.reset();
      console.log('se crea la cuenta nueva');
    }
  }



  updateCucumber(e) {
    this.checkbox = !this.checkbox
    if(this.checkbox == false){
      console.log('limpieza');
    }else{
      this.private = true;
    }
    
  }

}
