import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ProximaxProvider } from '../../../../providers/sdk/proximax.provider';
import { WalletService } from '../../service/wallet.service'
import { ToastProvider } from 'src/app/providers/toast/toast.provider';
import { StorageProvider } from 'src/app/providers/storage/storage.provider';
import { AuthService } from 'src/app/pages/auth/service/auth.service';

@Component({
  selector: 'app-wallet-send',
  templateUrl: './wallet-send.page.html',
  styleUrls: ['./wallet-send.page.scss'],
})
export class WalletSendPage implements OnInit {
  formSend: FormGroup;
  data: any;
  wallet: any;
  mosaic: { name: string; label: string; id: string; };
  mosaicsSelect: any;
  mosaics: any;
  cardMosaics: any;
  show: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private storage: Storage,
    private proximaxProvider: ProximaxProvider,
    private walletService: WalletService,
    private toastProvider: ToastProvider,
    private storageProvider: StorageProvider
  ) { }

  ngOnInit() {
    this.wallet = this.walletService.current;
    this.show = false;
    this.mosaicsSelect = [
      {
        value: "0",
        label: "Select mosaic",
        selected: true,
        disabled: true
      },
      {
        value: this.proximaxProvider.mosaicXpx.mosaicId,
        label: this.proximaxProvider.mosaicXpx.mosaic,
        selected: false,
        disabled: false
      }
    ];

    this.cardMosaics = [{
      name: "",
      mosaicId: "",
      amount: ""
    }]
    this.mosaics = this.walletService.mosaics;

    console.log('........', this.mosaicsSelect)
    this.namemosaics(this.mosaics);
    // this.mosaicsTransfer(this.mosaics);
    this.selectMosaics(this.mosaics)
    this.createForm();

  }

  createForm() {
    this.formSend = this.formBuilder.group({
      mosaicsSelect: [''],
      amount: [''],
      acountRecipient: ['', Validators.required],
      message: ['', Validators.required],
      password: ['', Validators.required],

    });
  }

  mosaicsTransfer(mosaics) {
    for (const m in mosaics) {
      const nameMosaic = (mosaics[m].name.length > 0) ? mosaics[m].name[0] : mosaics[m].mosaicId;
      if (mosaics[m].mosaicId != this.proximaxProvider.mosaicXpx.mosaicId) {
        this.mosaicsSelect.push({
          label: nameMosaic,
          value: mosaics[m].mosaicId,
          selected: false,
          disabled: false
        });
      }
      // console.log('naes. ', this.mosaicsSelect)
    }
  }
  selectMosaics(data) {
    if (data) {
      const datos = data.map(element => {
        return element.id;
      })
      this.walletService.getMosaicNames(datos).subscribe(
        response => {
          this.mosaics = [];
          response.forEach(element => {
            data.forEach(element2 => {
              if (element.mosaicId.toHex() === element2.id.toHex()) {
                let valores = {
                  mosaicId: element.mosaicId.id.toHex(),
                  name: element.names,
                  amount: this.walletService.amountFormatterSimple(element2.amount.compact())
                }
                this.mosaics.push(valores)
              }
            });
          });
          console.log('xxxxxxx', this.mosaics)
          this.mosaicsTransfer(this.mosaics);
        }

      );
    }
  }

  onChangeMosaic(e) {
    console.log('............. mostrar e', e)
    const valor = this.mosaics;
    for (const m in valor) {
      if (valor[m].name[0] === e.trim() || valor[m].mosaicId === e.trim()) {
        this.cardMosaics = valor[m];
        this.show = true;
        console.log('............. mostrar true')
      }
    }
    if (e.trim() === 'Select mosaic') {
      this.show = false;
    }
    this.formSend.patchValue({
      mosaicsSelect: this.cardMosaics.mosaicId
    })
  }
  namemosaics(mosaic) {
    if (mosaic === '0dc67fbe1cad29e3') {
      this.mosaic = {
        name: 'XPX',
        label: 'Proximax',
        id: '0dc67fbe1cad29e3'
      }
    } else {
      this.mosaic = {
        name: 'undefined',
        label: 'undefined',
        id: ''
      }
    }
  }

  onSubmit(form) {
    if (this.formSend.valid) {
      this.storageProvider.validatePaswword(form.password).then(status => {

        if (status.status === "success") {
          const acountRecipient = form.acountRecipient;
          const amount = form.amount;
          const message = form.message;
          const password = status.password
          const mosaic = form.mosaicsSelect;
          const common = { password: password };

          if (this.walletService.decrypt(common)) {
            console.log('decrypt ')
            const rspBuildSend = this.walletService.buildToSendTransfer(
              common,
              acountRecipient,
              message,
              amount,
              this.walletService.network,
              mosaic
            );
            rspBuildSend.transactionHttp
              .announce(rspBuildSend.signedTransaction)
              .subscribe(
                rsp => {
                  this.toastProvider.showToast('Transaction sent.')
                  this.formSend.reset();
                },
                async err => {
                  this.toastProvider.showToast('Error '.concat(err))
                }
              );
          }
          console.log(form)
        } else {
          this.toastProvider.showToast('incorrect information. Try again.')
        }
      })
    }
  }
}
