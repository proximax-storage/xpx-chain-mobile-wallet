import { NetworkType } from "tsjs-xpx-chain-sdk";

export const AppConfig = {
    app: {
      environment: 'dev'
    },
    sirius: {
      httpNodeUrl: "https://bctestnet1.brimstone.xpxsirius.io:3000",
      wsNodeUrl: "ws://bctestnet1.brimstone.xpxsirius.io:3000",
      networkType: NetworkType.TEST_NET,
      networkGenerationHash: '56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9'
    },
    xpxHexId: '13bfc518e40549d7',
    swap:{
      burnAccountAddress: 'TBF4LAZUEJMBIOC6J24D6ZGGXE5W775TX555CTTN'
    }
  };
  