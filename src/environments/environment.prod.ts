import { NetworkType } from 'tsjs-xpx-catapult-sdk'

export const environment = {
  production: true,
  network : NetworkType.TEST_NET,
  nameKeyNodeStorage: `proximax-movil-wallet-nodes`,
  protocol: `http`,
  protocolWs: `ws`,
  nodeDefault: 'bctestnet1.xpxsirius.io:3000'
};