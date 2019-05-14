import { NetworkType } from 'proximax-nem2-sdk'

export const environment = {
  production: true,
  network : NetworkType.MIJIN_TEST,
  nameKeyNodeStorage: `proximax-movil-wallet-nodes`,
  protocol: `http`,
  protocolWs: `ws`,
  nodeDefault: 'bctestnet1.xpxsirius.io:3000'
};