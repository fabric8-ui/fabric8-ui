Minimal Runtime for the Planner.

To use this with the Planner library:

0. Get dependencies for Planner (in planner root directory): `npm install`
1. Build the Planner library (in planner root directory): `gulp build:library`
2. Go to the library build directory (`dist-library`) and link to npm cache: `npm link`
3. Download dependencies for runtime (in runtime directory `runtime`): `npm install`
4. Link Planner library to runtime (in `runtime`): `npm link fabric8-planner`
5. Build and run runtime: (in `runtime`): `npm start`
