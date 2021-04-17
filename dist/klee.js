// src/modules/constants.js
var KLEEVERSION = "0.1.0-rc1";

// src/default.options.js
function getDefaultOptions(THREE) {
  return {
    debugLevel: 0,
    responsive: true,
    renderer: {
      type: "WebGLRenderer",
      args: [{antialias: true, preserveDrawingBuffer: true, alpha: true}],
      domElement: "body",
      clearColor: "#000000",
      opacity: 1,
      properties: {
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }
      }
    },
    camera: {
      type: "PerspectiveCamera",
      methods: {
        lookAt: [0, 0, 0]
      },
      properties: {
        position: {x: -1, y: 2, z: 5},
        name: "camera-1",
        fov: 35,
        aspect: window.innerWidth / window.innerHeight,
        near: 1,
        far: 300
      }
    },
    scene: {
      type: "Scene",
      properties: {
        name: "scene-1",
        position: {x: 0, y: 0, z: 0}
      }
    }
  };
}

// src/utils.js
var Utils = class {
  static merge(target, source) {
    if (!source || typeof source !== "object") {
      return target;
    }
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) {
        Object.assign(source[key], this.merge(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
  static isThreeColorValue(string) {
    const colorProperties = [
      "color",
      "specular",
      "emissive",
      "diffuse",
      "background"
    ];
    return colorProperties.includes(string);
  }
  static applyMethods(object, methods) {
    methods = methods || {};
    for (const method in methods) {
      const args = Array.isArray(methods[method]) ? methods[method] : [];
      if (!(method in object)) {
        console.log("Applied object has no method: " + method);
      } else {
        object[method](...args);
      }
    }
    return object;
  }
};

// src/modules/app.js
var App = function() {
  let options = {};
  let THREE;
  const local = {
    canvas: null,
    camera: null,
    renderer: null,
    scene: null,
    controls: null
  };
  function init(three, initOptions = {}) {
    if (!three || !three.REVISION) {
      error("THREE is not inserted");
    }
    THREE = {...three};
    if (!initOptions || typeof initOptions !== "object") {
      initOptions = {};
      warn("Options are set to default values");
    }
    const mergedOptions = Utils.merge(getDefaultOptions(THREE), initOptions);
    options = {...mergedOptions};
    local.renderer = initRenderer(options.renderer);
  }
  function run(callback) {
    local.renderer.render(local.scene, local.camera);
    if (local.controls) {
      if (local.controls.enableDamping || local.controls.autoRotate) {
        local.controls.update();
      }
    }
    if (typeof callback === "function") {
      callback();
    }
    requestAnimationFrame(() => run());
  }
  function initSize() {
    const isResponsive = options.responsive || false;
    const initialFov = local.camera.fov;
    const initialWidth = local.canvas.clientWidth;
    let width = local.canvas.clientWidth;
    let height = local.canvas.clientHeight;
    local.renderer.setSize(width, height);
    local.camera.aspect = width / height;
    local.camera.updateProjectionMatrix();
    if (isResponsive === false) {
      return;
    }
    window.addEventListener("resize", () => {
      const wWidth = window.innerWidth;
      width = local.canvas.clientWidth;
      height = local.canvas.clientHeight;
      if (wWidth !== width) {
        local.renderer.setSize(wWidth, height);
        local.camera.aspect = wWidth / height;
        local.camera.fov = initialFov * initialWidth / wWidth;
        local.camera.updateProjectionMatrix();
      }
    });
  }
  function initRenderer(o) {
    const domElement = document.querySelector(o.domElement);
    if (domElement instanceof HTMLCanvasElement) {
      o.args.canvas = domElement;
      local.canvas = domElement;
    }
    let renderer = createObject(o);
    renderer = applyRendererOptions(renderer, o.properties);
    renderer.setClearColor(new THREE.Color(o.clearColor), o.opacity);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (!local.canvas) {
      domElement.appendChild(renderer.domElement);
      local.canvas = renderer.domElement;
    }
    renderer.setSize(local.canvas.clientWidth, local.canvas.clientHeight);
    return renderer;
  }
  function createObject(o) {
    const args = Array.isArray(o.args) ? o.args : [];
    const object = new THREE[o.type](...args);
    return object;
  }
  function applyRendererOptions(renderer, o) {
    return Utils.merge(renderer, o);
  }
  function logMessage(message, type) {
    const level = options.debugLevel || 3;
    switch (type) {
      case "error":
        throw message;
      case "warn":
        if (level > 0) {
          console.warn(message);
        }
        break;
      case "info":
        if (level > 2) {
          console.info(message);
        }
        break;
      default:
        if (level > 1) {
          console.log(message);
        }
        break;
    }
  }
  function error(message) {
    logMessage(message, "error");
  }
  function warn(message) {
    logMessage(message, "warn");
  }
  function log(message) {
    logMessage(message, "log");
  }
  function info(message) {
    logMessage(message, "info");
  }
  return {
    get options() {
      return options;
    },
    get THREE() {
      return THREE;
    },
    get scene() {
      return local.scene;
    },
    set scene(object) {
      local.scene = object;
    },
    get camera() {
      return local.camera;
    },
    set camera(object) {
      local.camera = object;
    },
    get controls() {
      return local.controls;
    },
    set controls(object) {
      local.controls = object;
    },
    get renderer() {
      return local.renderer;
    },
    initSize,
    create: createObject,
    error,
    warn,
    log,
    info,
    init,
    run
  };
}();

// src/modules/object3d.js
var Object3d = function() {
  function add(options) {
    const object3d = create(options);
    App.scene.add(object3d);
    return object3d;
  }
  function create(options) {
    const THREE = App.THREE;
    const args = Array.isArray(options.args) ? options.args : [];
    let object = new THREE[options.type](...args);
    object = change(object, options);
    return object;
  }
  function change(object, options) {
    if (options.properties) {
      object = applyProperties(object, options.properties);
    }
    if (options.methods) {
      object = Utils.applyMethods(object, options.methods);
    }
    return object;
  }
  function applyProperties(object, options) {
    const THREE = App.THREE;
    if (!options || typeof options !== "object") {
      return object;
    }
    for (const prop in options) {
      if (options[prop] instanceof Object) {
        if ("copy" in object[prop]) {
          if ("toVector3" in object[prop] && "setFromVector3" in object[prop]) {
            const toVector3 = object[prop].toVector3();
            const mergedVector3 = {...toVector3, ...options[prop]};
            object[prop].setFromVector3(mergedVector3);
          }
          const v = {...object[prop], ...options[prop]};
          object[prop].copy(v);
        } else {
          object[prop] = applyProperties(object[prop], options[prop]);
        }
      } else {
        if (Utils.isThreeColorValue(prop)) {
          object[prop] = new THREE.Color(options[prop]);
        } else {
          object[prop] = options[prop];
        }
      }
    }
    return object;
  }
  return {
    add,
    create,
    change
  };
}(App);

// src/modules/scene.js
var Scene = function() {
  function init() {
    const options = App.options;
    App.camera = initCamera(options.camera);
    App.scene = initScene(options.scene);
    App.initSize();
  }
  function initScene(options) {
    const scene = Object3d.create(options);
    return scene;
  }
  function initCamera(options) {
    const camera = Object3d.create(options);
    camera.updateProjectionMatrix();
    return camera;
  }
  return {
    init
  };
}(App);

// src/modules/controls.js
var Controls = function() {
  function init(Controls2, options) {
    App.controls = initControls(Controls2, options);
  }
  function initControls(Controls2, options) {
    let controls = new Controls2(App.camera, App.renderer.domElement);
    controls = Object3d.change(controls, options);
    return controls;
  }
  return {
    init
  };
}(App);

// src/modules/light.js
var Light = function() {
  function create(options) {
    const light = Object3d.create(options);
    return light;
  }
  function change(light, options) {
    light = Object3d.change(light, options);
    return light;
  }
  function add(options) {
    if (typeof options === "object" && options.type) {
      return addOne(options);
    }
    const lights = [];
    if (Array.isArray(options)) {
      options.forEach((option) => {
        const light = addOne(option);
        lights.push(light);
      });
    }
    return lights;
  }
  function addOne(options) {
    const light = create(options);
    App.scene.add(light);
    return light;
  }
  return {
    add,
    create,
    change
  };
}(App);

// src/modules/material.js
var Material = function() {
  function create(options) {
    if (!options) {
      options = {
        type: "MeshPhongMaterial",
        args: [{color: 16777215}]
      };
    }
    let material = App.create(options);
    material = change(material, options);
    return material;
  }
  function change(object, options) {
    if (options.properties) {
      object = applyProperties(object, options.properties);
    }
    if (options.methods) {
      object = Utils.applyMethods(object, options.methods);
    }
    return object;
  }
  function applyProperties(object, options) {
    const THREE = App.THREE;
    if (!options || typeof options !== "object") {
      return object;
    }
    for (const prop in options) {
      if (options[prop] instanceof Object) {
        object[prop] = {...options[prop]};
      } else {
        if (Utils.isThreeColorValue(prop)) {
          object[prop] = new THREE.Color(options[prop]);
        } else {
          object[prop] = options[prop];
        }
      }
    }
    return object;
  }
  return {
    create,
    change
  };
}(App);

// src/modules/geometry.js
var Geometry = function() {
  function create(options) {
    if (!options) {
      options = {
        type: "BoxBufferGeometry",
        args: [1, 1, 1]
      };
    }
    let geometry = App.create(options);
    geometry = Utils.merge(geometry, options.properties);
    return geometry;
  }
  return {
    create
  };
}(App);

// src/modules/item.js
var Item = function() {
  function create(options) {
    const THREE = App.THREE;
    const material = Material.create(options.material);
    const geometry = Geometry.create(options.geometry);
    let mesh = new THREE.Mesh(geometry, material);
    mesh = change(mesh, options);
    return mesh;
  }
  function add(options) {
    if (typeof options === "object" && options.geometry) {
      return addOne(options);
    }
    const items = [];
    if (Array.isArray(options)) {
      options.forEach((option) => {
        const item = addOne(option);
        items.push(item);
      });
    }
    return items;
  }
  function addOne(options) {
    const mesh = create(options);
    App.scene.add(mesh);
    return mesh;
  }
  function change(object, options) {
    object = Object3d.change(object, options);
    return object;
  }
  return {
    add,
    create
  };
}(App);

// src/klee.js
console.log("klee.js: " + KLEEVERSION);
export {
  App,
  Controls,
  Geometry,
  Item,
  KLEEVERSION,
  Light,
  Material,
  Object3d,
  Scene
};
