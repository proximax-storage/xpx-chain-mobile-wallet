import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { SharedService } from '../../shared/services/shared.service';
import { ProximaxProvider } from '../../app/providers/sdk/proximax.provider';
import * as data from '../../assets/json/node.json';


@Injectable({
  providedIn: 'root'
})
export class NodeService {

  nodeObsSelected: BehaviorSubject<any>;
  nameItemsArrayStorage = environment.nameKeyNodeStorage;
  nameItemSelectedStorage = 'proximax-web-wallet-n-s';
  listNodes = data['nodes'];

  constructor(
    private proximaxProvider: ProximaxProvider,
    private storage: Storage,
  ) { }

//   addNode(node: string, showMsg = false, msgNodeCreated = '') {
//     const dataStorage = this.getAllNodes();
//     const data = { value: node, label: node };
//     if (dataStorage === null) {
//       this.setArrayNode([data]);
//     //   if (showMsg) this.sharedService.showSuccess('Congratulations!', msgNodeCreated);
//       return;
//     }

//     const issetData = dataStorage.find(element => element.value === node);
//     if (issetData === undefined) {
//       dataStorage.push(data);
//       this.setArrayNode(dataStorage);
//       if (showMsg) this.sharedService.showSuccess('Congratulations!', msgNodeCreated);
//       return;
//     }

//     if (showMsg) this.sharedService.showError('Node repeated', `The '${node}' node already exists`);
//   }

  /**
   *
   *
   * @param {any} url
   * @memberof NodeService
   */
  addNewNodeSelected(url: any) {
    this.nodeObsSelected.next(url);
  }

  /**
     * Init node and validations
     *
     * @returns
     * @memberof NodeService
     */
  initNode() {
    console.log('init node');
    if (this.getAllNodes() === null) {
        console.log('null');
      this.setArrayNode([]);
    };
    // validates if a selected node exists in the storage
    const constSelectedStorage = this.getNodeSelected();
    console.log('constSelectedStorage!', constSelectedStorage);
    const nodeSelected = (constSelectedStorage === null || constSelectedStorage === undefined) ? this.listNodes[0] : constSelectedStorage;
    console.log('nodeSelected!', nodeSelected);
    // creates a new observable
    this.nodeObsSelected = new BehaviorSubject<any>(nodeSelected);
    // Start the subscription function to the selected node.
    this.subscribeNodeSelected();

    // go through all the nodes that exist by default, and verify that they do not repeat in the storage
    this.listNodes.forEach(element => {
      this.validateToAddNode(element);
    });
  }


  /**
   * Add new selected node
   *
   * @memberof NodeService
   */
  subscribeNodeSelected() {
    console.log('suscribe !');
    this.nodeObsSelected.subscribe(
      next => {
        console.log('nest !', next);
        this.setSelectedNodeStorage(next);
        this.proximaxProvider.initInstances(next);
        // this.dataBridge.closeConenection();
        // this.dataBridge.connectnWs(next);
      }
    );
  }


//   /**
//    * add list of nodes in the storage
//    *
//    * @param {any} node
//    * @param {boolean} [showMsg=false]
//    * @param {string} [msgNodeCreated='']
//    * @returns
//    * @memberof NodeService
//    */
  validateToAddNode(node: any, showMsg: boolean = false, msgNodeCreated: string = '') {
    // check if there are nodes created in the storagr
    const dataStorage = this.getAllNodes();
    const data = { value: node, label: node };

    // const arrayNode = Object.keys(dataStorage).filter(item => dataStorage[item].value === node);
    // if there is no data in the storage, proceed to create a new node array in the storage
    if (dataStorage === null) {
      // Add an array of nodes in the storage
      this.setArrayNode([data]);
      if (showMsg) {
          console.log('Congratulations!', msgNodeCreated);
        // this.sharedService.showSuccess('Congratulations!', msgNodeCreated);
      }
      return;
    }

    // if there is data in the storage, verify that this data does not repeat in the storage
    // const existData = dataStorage.find((element: { value: any; }) => element.value === node);
    // if (existData === undefined) {
    //   dataStorage.push(data);
    //   this.setArrayNode(dataStorage);
    //   if (showMsg) {
    //     console.log('Congratulations!', msgNodeCreated);
    //     // this.sharedService.showSuccess('Congratulations!', msgNodeCreated);
    //   }
    //   return;
    // }

    if (showMsg) {
        console.log('Node repeated', `The '${node}' node already exists`);
    //   this.sharedService.showError('Node repeated', `The '${node}' node already exists`);
    }

  }

  /**
  * Add an array of nodes in the storage
  *
  * @param {any} nodes
  * @memberof NodeService
  */
  setArrayNode(nodes: any) {
    console.log('set vacio!', nodes);
    this.storage.set(this.nameItemsArrayStorage, JSON.stringify(nodes));
    // localStorage.setItem(this.nameItemsArrayStorage, JSON.stringify(nodes));
  }



  /**
   * Add new selected node in the storage
   *
   * @param {any} nodes
   * @memberof NodeService
   */
  setSelectedNodeStorage(node: any) {
    this.storage.set(this.nameItemSelectedStorage, node);
    // localStorage.setItem(this.nameItemSelectedStorage, JSON.stringify(node));
  }


  /**
   * Get all nodes
   *
   * @returns
   * @memberof NodeService
   */
  getAllNodes() {
    this.storage.get(this.nameItemsArrayStorage).then((val) => {
        return val;
    })
      
    // return JSON.parse(localStorage.getItem(this.nameItemsArrayStorage));
  }


  /**
   * Get a node selected
   *
   * @returns
   * @memberof NodeService
   */
  getNodeSelected() {
    this.storage.get(this.nameItemSelectedStorage).then((val) => {
        console.log('......................', val);
        return val;
    })
    // return JSON.parse(localStorage.getItem(this.nameItemSelectedStorage));
  }

  /**
   * Return node observable
   *
   * @returns
   * @memberof NodeService
   */
  getNodeObservable() {
    return this.nodeObsSelected.asObservable();
  }
}
