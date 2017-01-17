Minimal Runtime for the Planner.

To use this with the Planner library:

0. Get dependencies for Planner: `npm install`
1. Build the Planner library: `gulp build:library`
2. Go to the library build directory and link to npm cache: `npm link`
3. Download dependencies for runtime: `cd runtime && npm install`
4. Link Planner library to runtime (in `runtime`): `npm link fabric8-planner`
5. Build and run runtime: (in `runtime`): `npm start`
