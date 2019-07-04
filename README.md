# The ProximaX wallet is a simple and powerful full featured ProximaX wallet that allows you to send and receive currency with anyone anywhere in the world.
## ProximaX wallet is a secure wallet for ProximaX on top of NEM blockchain (NIS 1). 
## It is available for iOS and android.

## Wallet features:

* Local authentication
* Wallet management
* Contact management
* Send and receive transaction
* Multiple mosaic support
* Transaction history
* Changelly Integration
* Multisig account support
* Delegated harvesting
* Namespace and mosaic creation
* Coin market price for supported coins.
* Buy and sell XEMs using our Coinswitch Exchange integration.
* Creation of namespaces & mosaics 
* Market stats for ProximaX mosaic (XPX)
* PIN code security

Clone the repo and open the directory: 
```
git@github.com:proximax-storage/proximax-nem-wpro.git
cd proximax-nem-wpro
npm install
```

Testing on Real Devices
### iOS
Follow the Cordova [iOS Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/) to set up your development environment.

```
ionic cordova clean
ionic cordova platform rm ios
ionic cordova platform add ios
ionic cordova build ios
```

> If you are using the latest versions of XCode and Mac OS Mojave
```
ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"
```




### Android

Follow the Cordova [Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/) to set up your development environment.

```
ionic cordova clean
ionic cordova platform rm android
ionic cordova platform add android
ionic cordova run android
```
