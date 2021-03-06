import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { App } from '../../../../providers/app/app';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { MosaicInfo, Mosaic, UInt64, TransferTransaction, Deadline, PlainMessage, Address, AggregateTransaction, Account, SignedTransaction, Convert, NamespaceId, MosaicId } from 'tsjs-xpx-chain-sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertProvider } from '../../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { ConfigurationForm } from '../../../../providers/shared-service/shared-service';
import { AppConfig } from '../../../../app/app.config';
import { TransferTransactionProvider } from '../../../../providers/transfer-transaction/transfer-transaction';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { MosaicsProvider } from '../../../../providers/mosaics/mosaics';

/**
 * Generated class for the GiftCardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-gift-cards',
  templateUrl: 'gift-cards.html',
})
export class GiftCardsPage {

  App = App;
  addressOrigin: Address;
  addressDetination: any;
  addressSourceType: { from: string; to: string; };
  amountFormatter: string = '0';
  block: boolean;
  configurationForm: ConfigurationForm = {};
  currentWallet: any;
  dataGif: any;
  displaySuccessMessage: boolean = false;
  divisibility: number;
  form: FormGroup;
  hexadecimal: any;
  loading: boolean = true;
  mosaics: any;
  mosaicsHex: any;
  mosaicsAmount: any;
  idenficatorUser: any;
  msgErrorUnsupported: any;
  nameMosaic: string;
  showTransferable: boolean= true;
  feeMax: number;
  caracterMax: number = 10;
  noSoported: boolean = false;

  constructor(
    public alertProvider: AlertProvider,
    private barcodeScanner: BarcodeScanner,
    public formBuilder: FormBuilder,
    private haptic: HapticProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private proximaxProvider: ProximaxProvider,
    private translateService: TranslateService,
    private transferTransaction: TransferTransactionProvider,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    public walletProvider: WalletProvider,
    public mosaicsProvider: MosaicsProvider,
  ) {
    this.dataGif = this.navParams.data;
    this.mosaicsHex = AppConfig.xpxHexId.toLowerCase()
    this.mosaicsAmount = this.dataGif[0].amountGift
    // this.idenficatorUser = this.dataGif[0].des
    this.amountFormatter = this.mosaicsAmount
    const idValue = UInt64.fromHex(this.mosaicsHex)
    const isMisaic = this.proximaxProvider.validateIsMosaics(idValue)

    if (!isMisaic) {
      this.mosaics = new Mosaic(new NamespaceId([idValue.lower, idValue.higher]), UInt64.fromUint(Number(this.mosaicsAmount)));
      this.nameNamespace(idValue)
    } else {
      this.mosaics = new Mosaic(new MosaicId(this.mosaicsHex), UInt64.fromUint(Number(this.mosaicsAmount)));
      this.mosaicName(idValue)
      this.dataMosaics(idValue)
    }
    this.createForm()
    this.getAccountSelected()
    this.subscribeValue()
    this.calculateFeeTxComplete()

    // if (this.dataGif[0].typeGif === '0') {
    //   this.showTransferable = false
    // } else {
    //   this.noSoported = true
    // }
  }

  async nameNamespace(namespaceIds) {
    const namespaceNames = await this.getNamespacesName([namespaceIds]);
    if (namespaceNames.length > 0 && namespaceNames[0].name) {
      this.nameMosaic = namespaceNames[0].name
    }
    const namespace = await this.getNamespaces(namespaceIds);
    if (namespace && namespace['owner']) {
      this.addressDetination = namespace['owner'].address

      if (this.addressDetination.pretty()) {
        this.loading = false
      }
    }
  }


  async getNamespaces(namespaceIds: NamespaceId) {
    try {
      //Gets array of NamespaceName for an account
      const namespace = await this.proximaxProvider.namespaceHttp.getNamespace(namespaceIds).toPromise();
      return namespace;
    } catch (error) {
      //Nothing!
      return [];
    }
  }

  async getNamespacesName(namespaceIds: NamespaceId[]) {
    try {
      //Gets array of NamespaceName for an account
      const namespaceName = await this.proximaxProvider.namespaceHttp.getNamespacesName(namespaceIds).toPromise();
      return namespaceName;
    } catch (error) {
      //Nothing!
      return [];
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      recipientName: "",
      recipientAddress: [
        "",
        [
          Validators.required,
          Validators.minLength(40),
          Validators.maxLength(46)
        ]
      ],
      idenficatorUser: [
        this.dataGif[0].des ,
        [
          Validators.required,
          Validators.maxLength(this.caracterMax),
        ]
      ]
    })

    this.addressSourceType = {
      from: "contact",
      to: "contact"
    };

    // Defaults to manual contact input
    this.addressSourceType.to = "manual";
    if (this.addressSourceType.to === "manual") {
      this.form.get("recipientAddress").setValue("");
    }
  }


  calculateFeeTxComplete() {
    const networkType = AppConfig.sirius.networkType
    const giftCardAccount: Account = Account.createFromPrivateKey(this.dataGif[0].pkGift, networkType);
    const msg = JSON.stringify({ type: 'gift'})
    const deadLine = Deadline.create()

    const Tx1 = TransferTransaction.create(
      deadLine,
      this.addressOrigin,
      [this.mosaics],
      PlainMessage.create(msg),
      networkType
    )

    const Tx2 = TransferTransaction.create(
      deadLine,
      this.addressOrigin,
      [],
      PlainMessage.create(msg),
      networkType
    )

    const aggregateTx = AggregateTransaction.createComplete(
      deadLine,
      [
        Tx1.toAggregate(giftCardAccount.publicAccount),
        Tx2.toAggregate(giftCardAccount.publicAccount)
      ],
      networkType,
      []
    );
    this.feeMax = aggregateTx.maxFee.compact() * 20 / 100 + aggregateTx.maxFee.compact()
  }

  // OBTENER INFO DEL MOSAIC 
  async dataMosaics(id) {
    const mosaicsFound: MosaicInfo[] = await this.proximaxProvider.getMosaics([id]).toPromise();

    // this.addressDetination = mosaicsFound[0].owner.address
    this.divisibility = mosaicsFound[0].divisibility
    this.amountFormatter = this.proximaxProvider.amountFormatter(this.mosaicsAmount, this.divisibility)

    // if (this.addressDetination.pretty()) {
    //   this.loading = false
    // }

    // if (this.dataGif[0].typeGif === '0') {
    //   this.showTransferable = false
    // } else {
      // this.showTransferable = true
    // }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  // OBTENER LA CUENTA DEL DISTRIBUIDOR QUE ESTA EN STORAGE
  getAccountSelected() {
    this.walletProvider.getAccountSelected().then(currentWallet => {
      this.currentWallet = this.proximaxProvider.createFromRawAddress(currentWallet.account.address['address'])
      this.addressOrigin = this.currentWallet
    })
  }

  hexToString(hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftCardsPage');
  }

  init() {
  }

  // OBTENER NAME DEL MOSAIC 
  async mosaicName(id) {
    this.proximaxProvider.getMosaicsName([id]).subscribe(name => {
      if(name[0].names && name[0].names.length > 0){
        this.nameMosaic = name[0].names[0].name
      }
    })
  }

  maxCacarcter() {
    let str = this.form.controls.idenficatorUser.value;
    return str.length > this.caracterMax ? this.form.setErrors([{ caracterMax: true }]) : null;
  }

  onChangeTo(val) {
    if (val === "manual") {
      this.form.get("recipientName").setValue(null);
      this.form.get("recipientAddress").setValue(null);
    }
    if (val === "qrcode") {
      this.scan();
    }
  }

  onSubmit() {
    let addressDetination: any

    if (this.form.controls.recipientAddress.value === '') {
      addressDetination = this.addressDetination
    } else {
      addressDetination = this.proximaxProvider.createFromRawAddress(this.form.controls.recipientAddress.value)
    }

    this.block = true;
    const networkType = AppConfig.sirius.networkType
    const giftCardAccount: Account = Account.createFromPrivateKey(this.dataGif[0].pkGift, networkType);
    
    // toGovernmentTx
    const deadLine = Deadline.create()
    const msg = JSON.stringify({ type: 'gift', msg: 'gift card mobile wallet' })

    const toDetinationTx = TransferTransaction.create(
      deadLine,
      addressDetination,
      [this.mosaics],
      PlainMessage.create(msg),
      networkType,
      UInt64.fromUint(0)
    )

    // console.log('toDetinationTx;', toDetinationTx);

    // toOriginTx
    // const toOriginTx = TransferTransaction.create(
    //   deadLine,
    //   this.addressOrigin,
    //   [],
    //   PlainMessage.create(msg),
    //   networkType
    // )

    // Build Complete Transaction
    const aggregateTransaction = AggregateTransaction.createComplete(
      deadLine,
      [
        toDetinationTx.toAggregate(giftCardAccount.publicAccount),
        // toOriginTx.toAggregate(giftCardAccount.publicAccount)
      ],
      networkType,
      [],
      UInt64.fromUint(0)
      // UInt64.fromUint(this.feeMax)
    );
    // Sign bonded Transaction
    const signedTransaction: SignedTransaction = giftCardAccount.sign(aggregateTransaction, AppConfig.sirius.networkGenerationHash);
    // Announce Transaction
    this.proximaxProvider.announceTx(signedTransaction).subscribe(
      next => console.log('Tx sent......', signedTransaction),
      error => console.log('Error to Sent ->', error)
    );

    this.transferTransaction.checkTransaction(signedTransaction).subscribe(status => {
      this.block = false;
      if (status.group && status.group === 'unconfirmed' || status.group === 'confirmed') {
        this.displaySuccessMessage = true;
        this.showSuccessMessage();
      } else {
        this.showErrorMessage(status.status);
      }
    }, error => {
      this.showErrorMessage(error);
    })
  }

  serializeData(code, dni) {
    const codeUin8 = Convert.hexToUint8(code)
    const dniUin8 = Convert.hexToUint8(Convert.utf8ToHex(Convert.rstr2utf8(dni)))
    return this.concatUniArray(codeUin8, dniUin8)
  }

  showErrorMessage(error) {
    this.haptic.notification({ type: 'warning' });
    console.log('error', error);
    if (error.toString().indexOf('FAILURE_INSUFFICIENT_BALANCE') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.NOTES.PLACEHOLDER"));
    } else if (error.toString().indexOf('Failure_Core_Insufficient_Balance') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.NOTES.PLACEHOLDER"));
    } else if (error.toString().indexOf('Failure_Multisig_Operation_Not_Permitted_By_Account') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.TRANSFER.ALLOWED_FOR_MULTISIG"));
    } else {
      this.alertProvider.showMessage(
        error
      );
    }
  }

  showSuccessMessage() {
    setTimeout(() => {
      this.displaySuccessMessage = false;
      this.haptic.notification({ type: 'success' });
      this.utils.setTabIndex(2);
      this.navCtrl.setRoot(
        'TabsPage',
        {},
        {
          animate: true,
          direction: 'backward'
        }
      );
    }, 3000);
  }

  concatUniArray(buffer1, buffer2) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    console.log(tmp)
    return Convert.uint8ToHex(tmp);
  }

  unSerialize(hex) {
    const dataUin8 = Convert.hexToUint8(hex)
    const codeUin8 = new Uint8Array(20)
    const dniUin8 = new Uint8Array(8)
    codeUin8.set(new Uint8Array(dataUin8.subarray(0, 20)), 0)
    dniUin8.set(new Uint8Array(dataUin8.subarray(20, 28)), 0)
    const code = this.hexToString(Convert.uint8ToHex(codeUin8))
    const dni = UInt64.fromHex(Convert.uint8ToHex(dniUin8))
    console.log('code', code)
    console.log('dni', dni)
  }

  scan() {
    this.form.patchValue({ recipientAddress: "", emitEvent: false, onlySelf: true });
    this.barcodeScanner.scan().then(barcodeData => {
      barcodeData.format = "QR_CODE";
      let address = barcodeData.text.split("-").join("")
      if (address.length != 40) {
        this.alertProvider.showMessage(this.translateService.instant("WALLETS.SEND.ADDRESS.INVALID"))
      } else if (!this.proximaxProvider.verifyNetworkAddressEqualsNetwork(this.addressOrigin.pretty(), address)) {
        this.alertProvider.showMessage(this.translateService.instant("WALLETS.SEND.ADDRESS.UNSOPPORTED"))
      } else {
        this.form.patchValue({ recipientAddress: barcodeData.text });
      }
    }).catch(err => {
      if (err.toString().indexOf(this.translateService.instant("WALLETS.SEND.ERROR.CAMERA1")) >= 0) {
        let message = this.translateService.instant("WALLETS.SEND.ERROR.CAMERA2");
        this.alertProvider.showMessage(message);
      }
    });
  }

  selectContact(title) {
    this.utils.showInsetModal("SendContactSelectPage", { title: title }).subscribe(data => {
      if (data != undefined || data != null) {
        this.form.get("recipientName").setValue(data.name);
        this.form.get("recipientAddress").setValue(data.address);
      }
    });
  }

  subscribeValue() {
    // Account recipient
    this.form.get("recipientAddress").valueChanges.subscribe(value => {
      const accountRecipient = value !== undefined && value !== null && value !== "" ? value.split("-").join("") : "";
      if (accountRecipient !== null && accountRecipient !== undefined && accountRecipient.length === 40) {
        if (!this.proximaxProvider.verifyNetworkAddressEqualsNetwork(this.addressOrigin.pretty(), accountRecipient)) {
          this.msgErrorUnsupported = this.translateService.instant("WALLETS.SEND.ADDRESS.UNSOPPORTED");
        } else {
          this.msgErrorUnsupported = "";
        }
      } else {
        this.msgErrorUnsupported = this.translateService.instant("WALLETS.SEND.ADDRESS.INVALID");
      }
    });
  }
}
