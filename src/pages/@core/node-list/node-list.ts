import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { NemProvider } from '../../../providers/nem/nem';
import { Node, NodeEndpoint, ServerConfig, Protocol } from 'nem-library';
import { Storage } from '@ionic/storage';
import { AlertProvider } from '../../../providers/alert/alert';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProximaxProvider } from '../../../providers/proximax/proximax';
import { UInt64 } from 'tsjs-xpx-chain-sdk';
/**
 * Generated class for the NodeListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-node-list',
  templateUrl: 'node-list.html',
})
export class NodeListPage {
 
  url: string;
  public blockHeight: number  = 0;
  public nodes: Array<any> = [
    {name: "bctestnet1.xpxsirius.io", endpoint:"bctestnet1.xpxsirius.io"},
    {name: "bctestnet2.xpxsirius.io", endpoint:"bctestnet2.xpxsirius.io"},
    {name: "bctestnet3.xpxsirius.io", endpoint:"bctestnet3.xpxsirius.io"},
    {name: "bctestnet4.xpxsirius.io", endpoint:"bctestnet4.xpxsirius.io"},
    {name: "bctestnet5.xpxsirius.io", endpoint:"bctestnet5.xpxsirius.io"},
    {name: "bctestnet6.xpxsirius.io", endpoint:"bctestnet6.xpxsirius.io"},
  ];
  public node: Node;
  currentNode: string = "";
  selectedNode: NodeEndpoint;

  formGroup: FormGroup

  loading:any;
  
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private nem: NemProvider,
    private storage: Storage,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private alertProvider: AlertProvider,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService,
    private proximaxProvider: ProximaxProvider
    ) {
     
      this.getInfo();

      

      this.formGroup = this.formBuilder.group({
        ipAddress: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")]],
      });

  }

  getInfo() {
    this.storage.get('node').then(node => {
      const domain = JSON.parse(node).domain

      const url = "http://" + domain + ":3000/chain/height";
      this.http.get(url).subscribe(response => {
        const height = new UInt64(response['height']).compact()
        this.blockHeight = height;
      });

      const url1 = "http://" + domain + ":3000/node/info";
      this.http.get(url1).subscribe(response => {
        this.currentNode = response['host']
      });
    });
  }

  getNodeInfo(node: Node) {
    console.log('consulta getNodeInfo', node)
    // return node.endpoint.protocol + '://' + node.endpoint.host + ':' + node.endpoint.port
    return node.identity.name;
  }

  onChange() {
    console.log('this.selectedNode',this.selectedNode)
    this.validateIPaddress(this.selectedNode);
    // this.switchNode(this.selectedNode.protocol, this.selectedNode.host, this.selectedNode.port)
    
  }

   switchNode(protocol="http", host:string, port=3000){
    console.log('consulta getNodeInfo', protocol + '--' + host + '--' + port)

    let serverConfig: ServerConfig = { protocol: protocol as Protocol, domain: host, port: port};
    console.log("LOG: NodeListPage -> onChange -> serverConfig", serverConfig);

    this.storage.set("node", JSON.stringify(serverConfig)).then( _=>{
      console.log(_);
      const alertTitle = this.translateService.instant("SETTINGS.NODES.SWITCH", {'host' : host} );
      this.alertProvider.showMessage(alertTitle)
      setTimeout(()=> {
        window.location.reload();
      }, 1500)
      
      

    })
  }

  onSubmit(form) {
    this.validateIPaddress(form.ipAddress)
  }

  validateIPaddress(ipaddress) 
  {
    
    this.loading = this.loadingCtrl.create({
      content: 'Pinging ' + ipaddress
    });
    this.loading.present();
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
    {
      try {

        let url = "http://" + ipaddress + ":3000/node/info";
          let headers = new HttpHeaders();
          this.http.get(url, { headers: headers })
            .toPromise()
            .then(response => { 
              console.log("LOG: NodeListPage -> response", response);
              this.switchNode("http", ipaddress, 3000)
              this.loading.dismiss();
             })
            .catch((response: Response) => {
              console.log("LOG: NodeListPage -> response", response);
              this.alertProvider.showMessage("Invalid node. Please try again.");
              this.loading.dismiss();
             });
      } catch (error) {
				console.log("LOG: NodeListPage -> error", error);
      }
    } else {
      this.alertProvider.showMessage("The IP Address provided is invalid!");
    }
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad NodeListPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentLoadingDefault() {
    this.loading.present();
  }

}
