// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';

import {
  on as applicationOn,
  launchEvent, suspendEvent, resumeEvent, exitEvent,
  lowMemoryEvent,
  uncaughtErrorEvent,
  ApplicationEventData
} from "tns-core-modules/application";

applicationOn(launchEvent, (args: ApplicationEventData) => {
  if (args.android) {
    console.log('Launched Android application with the following intent: ' + args.android + '.');
  } else if (args.ios !== undefined) {
    console.log('Launched iOS application with options: ' + args.ios);
  }
});

applicationOn(suspendEvent, (args: ApplicationEventData) => {
  if (args.android) {
    console.log('Suspend Activity: ' + args.android);
  } else if (args.ios) {
    console.log('Suspend UIApplication: ' + args.ios);
  }
});

applicationOn(resumeEvent, (args: ApplicationEventData) => {
  if (args.android) {
    console.log('Resume Activity: ' + args.android);
  } else if (args.ios) {
    console.log('Resume UIApplication: ' + args.ios);
  }
});

// applicationOn(exitEvent, (args: ApplicationEventData) => {
//   if (args.android) {
//     console.log('Exit Activity: ' + args.android);
//   } else if (args.ios) {
//     console.log('Exit UIApplication: ' + args.ios);
//   }
// });

applicationOn(lowMemoryEvent, (args: ApplicationEventData) => {
  if (args.android) {
    console.log('LowMemory Activity: ' + args.android);
  } else if (args.ios) {
    console.log('LowMemory UIApplication: ' + args.ios);
  }
});

// applicationOn(uncaughtErrorEvent, (args: ApplicationEventData) => {
//   if (args.android) {
//     console.log("NativeScriptError: " + args.android);
//   } else if (args.ios) {
//     console.log("NativeScriptError: " + args.ios);
//   }
// });

// A traditional NativeScript application starts by initializing global objects, setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);
