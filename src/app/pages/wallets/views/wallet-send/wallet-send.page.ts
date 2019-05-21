import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { ProximaxProvider } from '../../../../providers/proximax.provider';
import { WalletService } from '../../service/wallet.service'
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-send',
  templateUrl: './wallet-send.page.html',
  styleUrls: ['./wallet-send.page.scss'],
})
export class WalletSendPage implements OnInit {
  formSend: FormGroup;
  data: any;
  wallet: any;
  mosaic: { name: string; label: string; id: string;};
  mosaicsSelect: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private storage: Storage,
    public toastController: ToastController,
    private proximaxProvider: ProximaxProvider,
    private walletService: WalletService,
  ) { }

  ngOnInit() {
    this.data = this.activatedRoute.snapshot.paramMap.get('data');
    this.wallet = JSON.parse(this.data)
    this.namemosaics(this.wallet['mosaics']);
    this.createForm();

    this.mosaicsSelect = [
      {
        value: "0",
        label: "Select mosaic",
        selected: true,
        disabled: true
      },
      {
        value: this.proximaxProvider.mosaicXpx.mosaic,
        label: this.proximaxProvider.mosaicXpx.mosaic,
        selected: false,
        disabled: false
      }
    ];
    // console.log('data recibida ....', this.wallet);
  }

  createForm() {
    this.formSend = this.formBuilder.group({
      mosaicsSelect: [this.proximaxProvider.mosaicXpx.mosaic,Validators.required],
      amount: ['', Validators.required],
      acountRecipient: ['', Validators.required],
      message: ['', Validators.required],
      password: ['', Validators.required],

    });
  }
  namemosaics(mosaic) {
    if (mosaic === '0dc67fbe1cad29e3') {
      this.mosaic = {
        name: 'XPX',
        label: 'Proximax',
        id: '0dc67fbe1cad29e3'
      }
    }else{
      this.mosaic = {
        name: 'undefined',
        label: 'undefined',
        id: ''
      }
    }
  }

  onSubmit(form) {
    console.log('llegando al function');
    // if (this.formSend.invalid) {
      console.log('formSend valid');
    this.storage.get('pin').then(async (val) => {
      console.log('pin store', val)
      console.log('pin form', form.password)
      if(val === form.password) {
        console.log('valido')
        const acountRecipient = form.acountRecipient;
        const amount = form.amount;
        const message =  form.message;
        const password = form.password
        const node = form.mosaicsSelect;

        const common = { password: password };

        console.log('acountRecipient ', acountRecipient +' amount ' + amount +' message ' + message +' password ' + password +' node ' + node +' common ' + common)
        console.log('common', JSON.stringify(common))
        if (this.walletService.decrypt(common)) {
          console.log('decrypt ')
          const rspBuildSend = this.walletService.buildToSendTransfer(
            common,
            acountRecipient,
            message,
            amount,
            this.walletService.network,
            node
          );
          rspBuildSend.transactionHttp
          .announce(rspBuildSend.signedTransaction)
          .subscribe(
            async rsp => {
              const toast = await this.toastController.create({
                message: 'Congratulations, Transaction sent.',
                duration: 3000
              });
              toast.present();
              // this.cleanForm();
            },
            async err => {
              const toast = await this.toastController.create({
                message: 'Error '.concat(err),
                duration: 3000
              });
              toast.present();
              // this.cleanForm();
              // this.sharedService.showError("Error", err);
              // console.error(err);
            }
          );
        }
        console.log(form)
      } else {
        const toast = await this.toastController.create({
          message: 'Incorrect password.',
          duration: 3000
        });
        toast.present();
      }
    })
  // }
}

}
