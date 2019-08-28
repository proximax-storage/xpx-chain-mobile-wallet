var fs = require('fs'),
  nem = 'src/providers/nem/nem.ts',
  config = 'config.xml';

function changeFileContent(file, text, textReplacement, successMessage) {
  fs.readFile(file, 'utf-8', function(err, data) {
    if (err) throw err;

    var newValue = data.replace(text, textReplacement);
    if (file === config) {
      newValue = newValue.replace(
        'co.hexdev.nemwallet.v2.testnet',
        'co.hexdev.nemwallet.v2.mainnet'
      );
    }

    fs.writeFile(file, newValue, 'utf-8', function(err) {
      if (err) throw err;
      console.log(successMessage);
    });
  });
}

changeFileContent(
  nem,
  'NEMLibrary.bootstrap(NetworkTypes.TEST_NET)',
  'NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)',
  '✓ Finished - Changing network to mainnet'
);

changeFileContent(
  config,
  'ProximaX Wallet TN',
  'ProximaX Wallet MN',
  '✓ Finished - Changing app name to "ProximaX Wallet MN"'
);
