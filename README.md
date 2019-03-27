# commons-app

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.0.


## Build & run connected device

```shellscript
$ npm run android

$ npm run ios
```

## Build & packaging binary

- android (debug build)

```shellscript
$ tns build android --bundle
```

- iOS (ios build for ad-hoc install)

```shellscript
$ tns build ios --release --bundle --for-device --provision commonsapp-tester
```
