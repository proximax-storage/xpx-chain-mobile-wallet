import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { NemProvider } from '../../../providers/nem/nem';
import { Node, NodeEndpoint, ServerConfig, Protocol, NodeHttp } from 'nem-library';
import { Storage } from '@ionic/storage';
import { AlertProvider } from '../../../providers/alert/alert';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
 
  public blockHeight: number  = 0;
  public nodes: Array<any> = [
    {name: "hugealice.nem.ninja", endpoint:"88.99.192.82"},
    {name: "hugealice2.nem.ninja", endpoint:"76.9.68.110"},
    {name: "hugealice3.nem.ninja  ", endpoint:"176.9.20.180"},
    {name: "hugealice4.nem.ninja", endpoint:"199.217.118.114"},
    {name: "bigalice3.nem.ninja", endpoint:"62.75.171.41"},
    {name: "san.nem.ninja", endpoint:"167.86.96.227"},
    {name: "go.nem.ninja", endpoint:"167.86.95.114"},
    {name: "hachi.nem.ninja", endpoint:"167.86.95.115"},
    {name: "jusan.nem.ninja", endpoint:"167.86.96.228"},
    {name: "nijuichi.nem.ninja", endpoint:"167.86.96.231"},
    {name: "alice2.nem.ninja", endpoint:"62.75.251.134"},
    {name: "alice3.nem.ninja", endpoint:"62.75.163.236"},
    {name: "alice4.nem.ninja", endpoint:"209.126.98.204"},
    {name: "alice5.nem.ninja", endpoint:"108.61.182.27"},
    {name: "alice6.nem.ninja", endpoint:"108.61.168.86"},
    {name: "alice7.nem.ninja", endpoint:"104.238.161.61"},
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
    private translateService: TranslateService
    ) {
     
      this.getInfo();

      

      this.formGroup = this.formBuilder.group({
        ipAddress: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")]],
      });

  }

  getInfo() {
    this.nem.getBlockHeight().then(block=> {
      console.log("LOG: NodeListPage -> block", block);
        this.blockHeight = block.height;
      })

      // this.nem.getActiveNodes().then((nodes: Array<Node>) => {
      // console.log("LOG: NodeListPage -> nodes", nodes);
      // //  this.nodes = nodes;

      // let alice = nodes.filter( node => {
      //    return node.identity.name.includes('Alice')
      // });

      // this.nodes = alice;

      // console.log("LOG: NodeListPage -> getInfo -> results", alice);
      // });

      // this.nem.getActiveNode().then((node: Node)=>{
      //   console.log("LOG: NodeListPage -> node", node);
      //   this.node = node;
      //   // this.currentNode = this.node.endpoint.protocol + '://' + this.node.endpoint.host + ':' +this.node.endpoint.port
      //   this.currentNode = this.node.identity.name;
        
      // })
  }

  getNodeInfo(node: Node) {
    // return node.endpoint.protocol + '://' + node.endpoint.host + ':' + node.endpoint.port
    return node.identity.name;
  }

  onChange() {
    this.validateIPaddress(this.selectedNode);
    // this.switchNode(this.selectedNode.protocol, this.selectedNode.host, this.selectedNode.port)
    
  }


   switchNode(protocol="http", host:string, port=7890){

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

        let url = "http://" + ipaddress + ":7890/node/info";
          let headers = new HttpHeaders();
          this.http.get(url, { headers: headers })
            .toPromise()
            .then(response => { 
              console.log("LOG: NodeListPage -> response", response);
              this.switchNode("http", ipaddress, 7890)
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
