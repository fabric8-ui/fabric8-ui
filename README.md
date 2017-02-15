# ngx-widgets
A collection of Angular components and other useful things to be shared.

You can see how it is used in our application [here](https://github.com/fabric8io/fabric8-ui).

The system we build is composed of several components existing in separate repos but
sharing common components, directives, and pipes. These widgets were extracted to 
provide a shared set of services. 

## Getting started:

This library does not run on it's own. It must be imported. 

`npm install ngx-widgets`

There are several services and a couple of models used by them available.

    container-toggle
    dialog
    dropdown
    editable
    icon
    infinitescroll
 

## Building it 
 
#### Install the dependencies:
 
 `npm install`
 
#### If you need to update the dependencies you can reinstall:
 
 `npm run reinstall`
 
#### Run the tests:
 
 `npm test`
 
#### Build the library:
 
 `npm run build`
 
#### Try it out locally. 
 
 We found that `npm link` doesn't fully work. You have to reference the library via `file:`. But you still need to create the link.
 
 - Start by running:
 
   `npm link dist`
 
 - Change this:
 
   `"ngx-widgets": "X.X.X"`
   
 - to this:
 
   `"ngx-widgets": "file:///[LOCATION-TO-NODE-MODULES]/.nvm/versions/node/v6.9.1/lib/node_modules/ngx-widgets"`
 
 
#### To publish it to NPM:
 
 `npm publish dist/`  
(_we don't want to publish the whole repo, just the built parts_)

