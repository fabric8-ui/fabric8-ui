# Minimal Standalone Runtime for the Planner

To use this with the Planner library:

1. Get dependencies for Planner (in planner root directory): `npm install`
2. Get dependencies for Planner Runtime (in `runtime`): `npm install`
3. Start the library build in watch mode (in planner root directory): `npm run watch:library`
4. Link Planner library to runtime (in `runtime`): `npm link ../dist-watch`
5. Set runtime mode to inmemory (if applicable): `export NODE_ENV=inmemory`
6. Build and run runtime: (in `runtime`): `npm start`
7. Point your browser to http://localhost:8080/


## Functional test
* To run all the functional tests you can simply run (in `runtime`): `npm run test:func`
* To run only the **smoke** functional tests you can simply run (in `runtime`): `npm run test:funcsmoke`
