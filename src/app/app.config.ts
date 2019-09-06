import { NetworkType } from "tsjs-xpx-chain-sdk";

export const AppConfig = {
    app: {
      environment: 'dev'
    },
    sirius: {
      httpNodeUrl: "https://bctestnet4.xpxsirius.io",
      wsNodeUrl: "ws://bctestnet1.xpxsirius.io",
      networkType: NetworkType.TEST_NET,
      networkGenerationHash: '3D9507C8038633C0EB2658704A5E7BC983E4327A99AC14D032D67F5AACBCCF6A'
    }
  };
  