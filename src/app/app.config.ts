import { NetworkType } from "tsjs-xpx-chain-sdk";
import { NetworkTypes, ServerConfig } from "nem-library";

export const AppConfig = {
    app: {
      environment: 'dev'
    },
    timeOutTransactionNis1: 20000,
    sirius: {
      httpNodeUrl: "https://bctestnet1.brimstone.xpxsirius.io",
      wsNodeUrl: "ws://bctestnet1.brimstone.xpxsirius.io:3000",
      networkType: NetworkType.TEST_NET,
      networkGenerationHash: '56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9'
    },
    xpxHexId: '13bfc518e40549d7',
    mosaicXpxInfo: {
      name: 'prx.xpx',
      coin: 'XPX',
      id: '13bfc518e40549d7',
      mosaicIdUint64: [3825551831, 331334936],
      namespaceIdUint64: [2434186742, 3220914849],
      namespaceId: 'bffb42a19116bdf6',
      divisibility: 6
    },
    swap:{
      url: 'https://bctestnetswap.xpxsirius.io:7890',
      urlExplorer: 'http://testnet-explorer.nemtool.com/#/s_tx?hash=',
      networkType: NetworkTypes.TEST_NET,
      burnAddress: 'TBF4LAZUEJMBIOC6J24D6ZGGXE5W775TX555CTTN',
      nodes: [
        { protocol: "https", domain: "bctestnetswap.xpxsirius.io", port: 7890 } as ServerConfig
      ],
    }
  };
  