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

In general the literal for a basic object looks like the following: 

    const obj = {
      type: constructor, // a three.js constructor
      args: argArray, // the args for the constructor as array
      properties: { // object literal with properties
        property1: value,
        property2: { x: xValue, y: yValue }
      },
      methods: { // object literal with methods of this object/class
        method1: argsArray1, // method args as array
        method2: argsArray2
      }
    };

An item/mesh has an enhanced specification for material and textures:

    const item = {
			geometry: {
        type: constructor, // a three.js geometry constructor
        args: argArray // the args for the constructor as array
			},
			material: {
				type: constructor, // a three.js material constructor
        properties: { // object literal with properties for the material
				  property1: value
				},
				textures: [ // array of textures images
					{
				    type: constructor, // a three.js texture constructor (default: TextureLoader)
						map: mapType, // type of the map (normalMap, aoMap, bumpMap etc)
						url: path/to/image, // path to the image, array for cube texture
						properties: { // properties of the map/texture
						  property1: value
						}
					},
				]
			},
			properties: { // item/mesh properties
			  property1: value
			}
    }

For more details and clarifications see examples in the example folder and the default.options.js in /src.

## demo/example

See examples in the example folder.

## tests

Running tests with Cypress requires a running webserver. So first start it:

    $ npm run test:serve &

Then start either the runner UI with

    $ npm run test:cy:open

or run all tests in CLI mode:

    $ npm run test:cy:run

## TODO in no particular order

* tests
* ~~simple objects~~
* ~~OrbitControls~~
* ~~textures~~
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

## credits

Examples contains assets from [CC0Textures.com](https://cc0textures.com/), licensed under CC0 1.0 Universal.
