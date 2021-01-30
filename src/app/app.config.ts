import { NetworkType } from "tsjs-xpx-chain-sdk";
import { NetworkTypes, ServerConfig } from "nem-library";

// export const AppConfig = {
//   app: {
//     environment: 'dev'
//   },
//   timeOutTransactionNis1: 20000,
//   sirius: {
//     nodes: [
//       "https://bctestnet1.brimstone.xpxsirius.io",
//       "https://bctestnet2.brimstone.xpxsirius.io",
//     ],
//     nodelist: [
//       { name: "bctestnet1.brimstone.xpxsirius.io", endpoint: "bctestnet1.brimstone.xpxsirius.io" },
//       { name: "bctestnet2.brimstone.xpxsirius.io", endpoint: "bctestnet2.brimstone.xpxsirius.io" },
//     ],
//     httpNodeUrl: "https://bctestnet1.brimstone.xpxsirius.io",
//     wsNodeUrl: "ws://bctestnet1.brimstone.xpxsirius.io:3000",
//     networkType: NetworkType.TEST_NET,
//     networkGenerationHash: '56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9'
//   },
//   accountGiftTest: 'VCER34-5Q2YJR-GE6YSU-H4HJM7-6AN7C2-I5NIMY-2KFE',
//   nameNamespaceGiftTest: 'two4one.hampervoucher.laikipia',
//   namespaceLikipia: 'cf231d202ab020fa',
//   xpxHexId: '13bfc518e40549d7',
//   accountExample: 'TDDG3UDZBGZUIOCDCOPT45NB7C7VJMPMMNWVO4MH',
//   mosaicXpxInfo: {
//     name: 'prx.xpx',
//     coin: 'XPX',
//     id: '13bfc518e40549d7',
//     mosaicIdUint64: [3825551831, 331334936],
//     namespaceIdUint64: [2434186742, 3220914849],
//     namespaceId: 'bffb42a19116bdf6',
//     divisibility: 6
//   },
//   swap: {
//     url: 'https://bctestnetswap.xpxsirius.io:7890',
//     urlExplorer: 'http://testnet-explorer.nemtool.com/#/s_tx?hash=',
//     networkType: NetworkTypes.TEST_NET,
//     burnAddress: 'TBF4LAZUEJMBIOC6J24D6ZGGXE5W775TX555CTTN',
//     addressAccountMultisig: 'VAWOEOWTABXR7O3ZAK2XNA5GIBNE6PZIXDAFDWBU',
//     addressAccountSimple: 'VCWLIYQPQAJSYWMWL5BHUCA3VOWVOXZ3WTNJPTUJ',
//     nodes: [
//       { protocol: "https", domain: "bctestnetswap.xpxsirius.io", port: 7890 } as ServerConfig
//     ],
//   }
// };


export const AppConfig = {
  app: {
    environment: 'main'
  },
  timeOutTransactionNis1: 20000,
  sirius: {
    nodes: [
      "https://arcturus.xpxsirius.io",
      "https://aldebaran.xpxsirius.io",
      "https://betelgeuse.xpxsirius.io",
      "https://bigcalvin.xpxsirius.io",
      "https://delphinus.xpxsirius.io",
      "https://lyrasithara.xpxsirius.io"
    ],
    nodelist: [
      { name: "arcturus.xpxsirius.io", endpoint: "arcturus.xpxsirius.io" },
      { name: "aldebaran.xpxsirius.io", endpoint: "aldebaran.xpxsirius.io" },
      { name: "betelgeuse.xpxsirius.io", endpoint: "betelgeuse.xpxsirius.io" },
      { name: "bigcalvin.xpxsirius.io", endpoint: "bigcalvin.xpxsirius.io" },
      { name: "delphinus.xpxsirius.io", endpoint: "delphinus.xpxsirius.io" },
      { name: "lyrasithara.xpxsirius.io", endpoint: "lyrasithara.xpxsirius.io" },

    ],
    httpNodeUrl: "https://arcturus.xpxsirius.io",
    wsNodeUrl: "ws://arcturus.xpxsirius.io:3000",
    networkType: NetworkType.MAIN_NET,
    networkGenerationHash: '10540AD3A1BF46B1A05D8B1CF0252BC9FB2E0B53CFD748262B0CE341CEAFEB6B'
  },

  accountGiftTest: 'XDF4RLEV4MKNMYWZO2AYIPXHUDJ4OWHHEESYF26Q',
  nameNamespaceGiftTest: 'two4one.hampervoucher.laikipia',
  namespaceLikipia: 'cf231d202ab020fa',
  xpxHexId: '402b2f579faebc59',
  accountExample: 'XDDXG3UDZBGZUIOCDCOPT45NB7C7VJMPMMNWVO4P',
  mosaicXpxInfo: {
    name: 'prx.xpx',
    coin: 'XPX',
    id: '402b2f579faebc59',
    mosaicIdUint64: [2679028825, 1076571991],
    namespaceIdUint64: [2434186742, 3220914849],
    namespaceId: 'bffb42a19116bdf6',
    divisibility: 6
  },
  swap: {
    url: 'https://swap.brimstone.xpxsirius.io:7890',
    urlExplorer: 'http://explorer.nemtool.com/#/s_tx?hash=',
    networkType: NetworkTypes.MAIN_NET,
    burnAddress: 'ND7WVWPWNTJR75CYC3D73LSVP7WIL7BL77QNT7NZ',
    addressAccountMultisig: 'XDKK47EMX4Q2NVU6TIN4RS22SZZ47UEFJ454L4NV',
    addressAccountSimple: 'XDHQTCJLDDSNOVXPGRE25YNHXV27EAKAEUGJKRLK',
    nodes: [{
      protocol: "https",
      domain: "swap.brimstone.xpxsirius.io",
      port: 7890
    } as ServerConfig],
  }
};