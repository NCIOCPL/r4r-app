This all is a hot mess to support moving R4R to be a generic app module. The "correct" way to do this would be to update analytics to use the EDDL + react-tracking instead of the dumb data layer. This would require us to completely change how we fetch and update data in the application. (Right now multiple events occur for a click or load because of how the caching redraws.) So yeah, we need to update all the analytics, and to do that we need to update the app.

So in order to get this into CGDP as a generic app module, and thus remove a bunch of old dependencies from the CGDP node_modules, we have just copied out what we needed from the front-end.

The following files are a copy & paste from the front-end:
* analyticsHandler
* dumb-datalayer
* eventHandler
* exitDisclaimerHandler

The cgdp-generic-app-module-init.js module is a combination of the old R4R initialization function from cgdp, and what is needed for a genericAppModule. This will be exported to the window for the generic app module.