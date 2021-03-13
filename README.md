# klee.js

klee.js is a (data driven) generator and wrapper for the magnificent [three.js](https://threejs.org/).

The main usage is to programmatically create a WebGL scene by a backend (CMS, database, server-side scripts etc.). The backend handles and manage the objects, textures, positions and so forth and pipes this info to the generator which then builds the scene via three.js.

**Be aware:** This project is fresh and raw so expect changes in the API.

## data

The data that will generate the scene is written as JavaScript object literal and can come from a parsed JSON file and/or directly from a CMS.

**data schema**

The renderer, camera and scene are managed by an option object literal which is injected to init the app.
The default options (default.options.js) are highly opinionated but can be changed. The options for the renderer are a bit different than for the other objects.

Meshs are builds from geometries and materials and can be added as array. See the basic-cube-and-sphere example.

In general the literal for an object looks like the following: 

    const obj = {
      type: contructor, // a three.js contructor
      args: argArray, // the args for the contructor as array
      properties: { // object literal with properties
        property1: value,
        property2: { x: xValue, y: yValue }
      },
      methods: { // object literal with methods of this object/class
        method1: argsArray1, // method args as array
        method2: argsArray2
      }
    };

For more details and clarifications see examples in the example folder and the default.options.js in /src.

## demo/example

See examples in the example folder.

## TODO in no particular order

* tests
* ~~simple objects~~
* ~~OrbitControls~~
* textures
* groups
* raycaster
* selections
* backup/restore
* transactions
* Collada-, GLTF-Import
* physics
* collisions
* constructive solid geometries
* interactions
* dragging
* gridsystem
* userData
* examples
* ...
