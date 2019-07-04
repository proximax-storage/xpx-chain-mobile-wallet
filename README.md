
# ProximaX Chain Wallet
#### A simple yet elegant wallet for ProximaX blockchain.

[![Appstore](https://camo.githubusercontent.com/ddac8b1e589cfdb5b7ed6efd92fca87cf4553f1a/68747470733a2f2f626c756577616c6c65742e696f2f696d672f6170702d73746f72652d62616467652e737667)](https://testflight.apple.com/join/qZ6fNqfs)
[![Playstore](https://camo.githubusercontent.com/2d939268876bda13dd071b99aa75daf82ef8c4f3/68747470733a2f2f626c756577616c6c65742e696f2f696d672f706c61792d73746f72652d62616467652e737667)](https://play.google.com/store/apps/details?id=io.proximax.walletv2)

Website: [proximax.io](http://proximax.io)

Community: [telegram group](https://t.me/ProximaXio)

*  Private keys never leave your device
*  Create as many wallets as you want
*  Supports multiple mosaics such as XPX, XEM, PUNDIX, SPORTSFIX, XARCADE and many more
*  Support multisignature enabled accounts and transactions
*  Latest price index and market statistics
*  PIN code security for secondary layer of protection
* And many more [features...](https://prx-wallet-v2.herokuapp.com/)

Beta version, do not use to store large amounts!


<img src="https://i.imgur.com/0cASI15.jpg" width="100%">





## BUILD & RUN IT

* In your console:

Clone the repo and open the directory: 
```
git@github.com:proximax-storage/proximax-nem-wpro.git
cd proximax-nem-wpro
npm install
```
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


## ABOUT PROXIMAX

ProximaX is a next generation platform solution with an Integrated and Distributed Ledger Technology (IaDLT). The ProximaX Sirius platform is an integrated assembly of proven technologies for enterprises to develop applications with superior design while substantially reducing the total cost of ownership and time to market.

### Advantages
*  A highly available, integrated, and distributed technology means your business uptime is guaranteed.
*  Storage of files are encrypted by default, ensuring your data is secured, always.
*  Database entries are immutable, utilising blockchain's main attributes.
*  The transparency of our asset transaction engine is complete with an audit trail. You’ll know where your data is, at all times.


## WANT TO CONTRIBUTE?

Grab an issue from [the backlog](https://trello.com/b/c4EL9es1), try to start or submit a PR, any doubts we will try to guide you.

Join us at our [telegram group](https://t.me/proximax_devs) where we hangout :+1:

## Responsible disclosure

Found critical bugs/vulnerabilities? Please email them support@proxima.io
Thanks!
