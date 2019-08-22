export const AppConfig = {
    app: {
      environment: 'dev'
    },
    sirius: {
      httpNodeUrl: "http://bctestnet1.xpxsirius.io:3000",
      wsNodeUrl: "ws://bctestnet1.xpxsirius.io",
      networkType: "TEST_NET",






































      
      addressPrefix: "VDF",
      dummyRecipients: [
        { name: 'autosign1', privateKey: '44CC002B8102BA0F9ED957D6D459D4499822A1FE39C456BFDD43133786D4DF42', publicKey: '5ED14B5538109A07CDFBF6953945CC2C27181900970058D1D6ECC22498FBD530' },
        { name: 'autosign2', privateKey: '5FDDAED1D4ED7B29BEF963CE585FAF8DBA38C229FFFB424EC56B4E9B613ACA8E', publicKey: '88F6E5D7589C1EEF257667FEB59F8034532812A52E1C69B582954FEB34BAFB47' },
        { name: 'director1', privateKey: '', publicKey: '96F90B36524020F579C394A781F20780CF362C014E908260784F4A761FAC6C76' },
      ],
      mosaics: [
        {
          name: "dragonfly.usd",
          currency: 'USD',
          hexId: "7edef6d8e402a0f5",
          divisibility: 6
        },
        {
          name: "dragonfly.khr",
          currency: 'KHR',
          hexId: "6495a5220d4f8322",
          divisibility: 4
        },
        {
          name: "amc.coin",
          hexId: "4d54aa7ce84c0f1b",
          divisibility: 6
        }
      ],
      blockedMosaics: [
        {
          name1: "amc.coin",
          name: "amc",
          hexId: "4d54aa7ce84c0f1b",
          divisibility: 6
        }
      ],
      lockFundMosaic: {
        name: "prx:xpx",
        hexId: "0dc67fbe1cad29e3"
          },
          namespace: {
              expiryInBlocks: 2090000
          }
    },
    dataApi: { url: "http://13.229.55.184:8801" }
  };
  