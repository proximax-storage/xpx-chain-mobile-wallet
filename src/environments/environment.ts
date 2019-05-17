// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import { NetworkType } from 'proximax-nem2-sdk'
import { NetworkType } from 'tsjs-xpx-catapult-sdk';


export const environment = {
  production: false,
  network : NetworkType.TEST_NET,
  nameKeyNodeStorage: `proximax-movil-wallet-nodes`,
  protocol: `http`,
  protocolWs: `ws`,
  nodeDefault: 'bcstage1.xpxsirius.io:3000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
// tsjs-xpx-catapult-sdk