// src/modules/constants.js
var KLEEVERSION = "0.11.0";

// src/default.options.js
function getDefaultOptions(THREE) {
  return {
    debugLevel: 0,
    // 0,1,2,3
    responsive: true,
    renderer: {
      type: "WebGLRenderer",
      args: [{ antialias: true, preserveDrawingBuffer: true, alpha: true }],
      domElement: "body",
      clearColor: "#000000",
      opacity: 1,
      properties: {
        // outputEncoding: THREE.sRGBEncoding,
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
        position: { x: -1, y: 2, z: 5 },
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
        position: { x: 0, y: 0, z: 0 }
      }
    }
  };
}

// src/utils.js
var Utils = class {
  // https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
  // mutates target for read-only properties
  static merge(target, source) {
    if (!source || typeof source !== "object") {
      return target;
    }
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && typeof target[key] !== "undefined") {
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
      "background",
      "sheen"
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
var App = /* @__PURE__ */ function() {
  let options = {};
  let THREE;
  const local = {
    canvas: null,
    camera: null,
    renderer: null,
    scene: null,
    mouse: null,
    raycaster: null,
    manager: null,
    controls: {
      OrbitControls: null
    },
    movingLimits: null,
    draggables: [],
    draggableObject: null,
    collidables: [],
    faceables: [],
    actions: {
      isDragging: false
    }
  };
  function init(three, initOptions = {}) {
    if (!three || !three.REVISION) {
      error("THREE is not inserted");
    }
    THREE = { ...three };
    if (!initOptions || typeof initOptions !== "object") {
      initOptions = {};
      warn("Options are set to default values");
    }
    const mergedOptions = Utils.merge(getDefaultOptions(THREE), initOptions);
    options = { ...mergedOptions };
    local.renderer = initRenderer(options.renderer);
    local.manager = new THREE.LoadingManager();
  }
  function run(callback) {
    local.renderer.render(local.scene, local.camera);
    if (local.controls.OrbitControls) {
      if (local.controls.OrbitControls.enableDamping || local.controls.OrbitControls.autoRotate) {
        local.controls.OrbitControls.update();
      }
    }
    if (typeof callback === "function") {
      callback();
    }
    requestAnimationFrame(() => run(callback));
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
    const resizeObserver = new ResizeObserver((entry) => {
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
    resizeObserver.observe(document.querySelector("body"));
  }
  function initRenderer(o) {
    local.domElement = document.querySelector(o.domElement);
    if (local.domElement instanceof HTMLCanvasElement) {
      o.args.canvas = local.domElement;
      local.canvas = local.domElement;
    }
    let renderer = createObject(o);
    renderer = applyRendererOptions(renderer, o.properties);
    renderer.setClearColor(new THREE.Color(o.clearColor), o.opacity);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (!local.canvas) {
      local.domElement.appendChild(renderer.domElement);
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
    const level = options.debugLevel !== void 0 ? options.debugLevel : 3;
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
    get canvas() {
      return local.canvas;
    },
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
    get renderer() {
      return local.renderer;
    },
    get manager() {
      return local.manager;
    },
    get collidables() {
      return local.collidables;
    },
    set collidables(collidables) {
      local.collidables = collidables;
    },
    get draggableObject() {
      return local.draggableObject;
    },
    set draggableObject(object) {
      local.draggableObject = object;
    },
    get draggables() {
      return local.draggables;
    },
    set draggables(draggables) {
      local.draggables = draggables;
    },
    get faceables() {
      return local.faceables;
    },
    set faceables(faceables) {
      local.faceables = faceables;
    },
    get mouse() {
      return local.mouse;
    },
    set mouse(mouseVector2) {
      local.mouse = mouseVector2;
    },
    get movingLimits() {
      return local.movingLimits;
    },
    set movingLimits(minMaxLimits) {
      local.movingLimits = minMaxLimits;
    },
    get raycaster() {
      return local.raycaster;
    },
    set raycaster(raycaster) {
      local.raycaster = raycaster;
    },
    get actions() {
      return local.actions;
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

// src/modules/userdata.js
var UserData = /* @__PURE__ */ function() {
  function handle(object, userData) {
    const f = {
      collidable: (action) => addCollidables(object, action),
      draggable: (action) => addDraggables(object, action),
      faceable: (action) => addFaceable(object, action),
      movingLimiter: (action) => setMovingLimits(object, action)
    };
    for (const action in userData) {
      if (userData[action] && f[action]) {
        f[action](action);
      }
    }
    object.userData = { ...object.userData, ...userData };
  }
  function setMovingLimits(object, action) {
    const THREE = App.THREE;
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(object);
    App.movingLimits = {
      min: boundingBox.min,
      max: boundingBox.max
    };
  }
  function addDraggables(object, action) {
    if (action) {
      App.draggables.push(object);
    }
  }
  function addCollidables(object, action) {
    if (action) {
      App.collidables.push(object);
    }
  }
  function addFaceable(object, action) {
    if (action) {
      App.faceables.push(object);
    }
  }
  return {
    handle
  };
}(App);

// src/modules/object3d.js
var Object3d = /* @__PURE__ */ function() {
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
        if (typeof object[prop] !== "undefined" && "copy" in object[prop]) {
          if ("setFromVector3" in object[prop]) {
            const toVector3 = new THREE.Vector3();
            toVector3.setFromEuler(object[prop]);
            const mergedVector3 = { ...toVector3, ...options[prop] };
            object[prop].setFromVector3(mergedVector3);
          }
          const v = { ...object[prop], ...options[prop] };
          object[prop].copy(v);
        } else {
          if (prop === "userData") {
            UserData.handle(object, options[prop]);
          } else {
            object[prop] = applyProperties(object[prop], options[prop]);
          }
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
var Scene = /* @__PURE__ */ function() {
  function init() {
    const options = App.options;
    App.camera = initCamera(options.camera);
    App.scene = initScene(options.scene);
    App.initSize();
  }
  function initScene(options) {
    const scene = Object3d.create(options);
    (async () => {
      scene.background = await createSceneTextures(options.background);
      scene.environment = await createSceneTextures(options.environment);
    })();
    return scene;
  }
  function initCamera(options) {
    const camera = Object3d.create(options);
    camera.updateProjectionMatrix();
    return camera;
  }
  async function createSceneTextures(options) {
    if (!options) {
      return null;
    }
    const THREE = App.THREE;
    const loaderType = options.loader || "TextureLoader";
    const loader = new THREE[loaderType](App.manager);
    const texture = await loader.loadAsync(options.url);
    return texture;
  }
  return {
    init
  };
}(App);

// src/modules/controls.js
var Controls = /* @__PURE__ */ function() {
  function init(Controls2, options) {
    App.controls[Controls2.name] = initControls(Controls2, options);
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

// src/modules/loaders.js
var Loaders = /* @__PURE__ */ function() {
  const Loaders2 = {};
  function init(LoaderClass) {
    Loaders2[LoaderClass.name] = new LoaderClass(App.manager);
  }
  async function load(options) {
    const item = await Loaders2[options.loader].loadAsync(options.url);
    return item;
  }
  return {
    init,
    load
  };
}(App);

// src/modules/light.js
var Light = /* @__PURE__ */ function() {
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
var Material = /* @__PURE__ */ function() {
  function create(options) {
    if (!options) {
      options = {
        type: "MeshPhongMaterial",
        args: [{ color: 16777215 }]
      };
      App.info("No options for material given, using default MeshPhongMaterial in white");
    }
    let material = App.create(options);
    material = change(material, options);
    return material;
  }
  function change(object, options) {
    const THREE = App.THREE;
    if (options.properties) {
      object = applyProperties(object, options.properties);
    }
    if (options.methods) {
      object = Utils.applyMethods(object, options.methods);
    }
    if (options.textures) {
      options.textures.forEach(async (texture) => {
        const loaderType = texture.loader || "TextureLoader";
        const loader = new THREE[loaderType](App.manager);
        const mapType = texture.map;
        const mapTexture = await loader.loadAsync(texture.url);
        object[mapType] = mapTexture;
        if (texture.properties) {
          object[mapType] = applyProperties(object[mapType], texture.properties);
        }
        if (texture.methods) {
          object[mapType] = Utils.applyMethods(object, texture.methods);
        }
      });
      object.needsUpdate = true;
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
        object[prop] = { ...options[prop] };
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
var Geometry = /* @__PURE__ */ function() {
  function create(options) {
    if (!options) {
      options = {
        type: "BoxGeometry",
        args: [1, 1, 1]
      };
      App.info("No options for geometry given, using default BoxGeometry 1x1x1");
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
var Item = /* @__PURE__ */ function() {
  function create(options) {
    const THREE = App.THREE;
    const material = Material.create(options.material);
    const geometry = Geometry.create(options.geometry);
    let mesh = new THREE.Mesh(geometry, material);
    mesh = change(mesh, options);
    return mesh;
  }
  function add(options) {
    if (typeof options === "object") {
      if (options.loader) {
        return addFromLoader(options);
      }
      if (options.geometry) {
        return addMesh(options);
      }
    }
    const items = [];
    if (Array.isArray(options)) {
      options.forEach((option) => {
        const item = add(option);
        items.push(item);
      });
    }
    return items;
  }
  async function addFromLoader(options) {
    let item = await Loaders.load(options);
    if (item.scene) {
      let parent = wrapGroupParent(item.scene, options);
      parent = change(parent, options);
      parent.receiveShadow = false;
      parent.castShadow = false;
      App.scene.add(parent);
      return parent;
    } else {
      item = change(item, options);
      App.scene.add(item);
      return item;
    }
  }
  function wrapGroupParent(item, options) {
    const THREE = App.THREE;
    const box = new THREE.Box3().setFromObject(item);
    const center = box.getCenter(new THREE.Vector3());
    const offset = 1e-3;
    const dim = {
      x: box.max.x - box.min.x + offset,
      y: box.max.y - box.min.y + offset,
      z: box.max.z - box.min.z + offset
    };
    const geo = new THREE.BoxGeometry(dim.x, dim.y, dim.z);
    if (!options.material) {
      options.material = {
        color: 16777215,
        transparent: true,
        opacity: 0
      };
    }
    const mat = new THREE.MeshBasicMaterial(options.material);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = dim.y / 2;
    item.position.x += item.position.x - center.x;
    item.position.y += item.position.y - center.y;
    item.position.z += item.position.z - center.z;
    mesh.renderOrder = 1;
    item.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = options.properties.receiveShadow || false;
        child.castShadow = options.properties.castShadow || false;
        child.material.side = THREE.DoubleSide;
      }
    });
    mesh.add(item);
    return mesh;
  }
  function addMesh(options) {
    const mesh = create(options);
    App.scene.add(mesh);
    return mesh;
  }
  function change(object, options) {
    object = Object3d.change(object, options);
    if (options.material) {
      Material.change(object.material, options.material);
    }
    return object;
  }
  function remove(object) {
    App.collidables = App.collidables.filter((item) => item !== object);
    App.draggables = App.draggables.filter((item) => item !== object);
    App.scene.remove(object);
  }
  return {
    add,
    create,
    change,
    remove
  };
}(App);

// src/modules/dragging.js
var Dragging = /* @__PURE__ */ function() {
  let tmpMaterial = null;
  let plane = null;
  let planeNormal = null;
  let pointIntersect = null;
  let distance = null;
  function init() {
    const THREE = App.THREE;
    plane = new THREE.Plane();
    planeNormal = new THREE.Vector3(0, 1, 0);
    pointIntersect = new THREE.Vector3();
    distance = new THREE.Vector3();
  }
  function start(object = null, intersects = null) {
    const THREE = App.THREE;
    intersects = intersects ?? (object ? App.raycaster.intersectObject(object) : App.raycaster.intersectObjects(App.draggables));
    if (intersects.length <= 0) return;
    App.draggableObject = object ?? intersects[0].object;
    pointIntersect.copy(intersects[0].point);
    plane.setFromNormalAndCoplanarPoint(planeNormal, pointIntersect);
    distance.subVectors(App.draggableObject.position, intersects[0].point);
    const bBox = new THREE.Box3().setFromObject(App.draggableObject);
    const size = new THREE.Vector3();
    bBox.getSize(size);
    App.draggableObject.userData.tmp = {
      bbox: bBox,
      size
    };
    App.controls.OrbitControls.enabled = false;
    App.actions.isDragging = true;
    App.canvas.style.cursor = "grab";
    let onDragStartCallback = App.draggableObject.userData?.callbacks?.onDragStart ?? (() => {
    });
    if (typeof App.draggableObject.userData?.callbacks?.onDragStart === "string") {
      onDragStartCallback = new Function("return " + App.draggableObject.userData.callbacks.onDragStart)();
    }
    onDragStartCallback(App);
    if (App.draggableObject.userData.dragMaterial) {
      tmpMaterial = App.draggableObject.material;
      App.draggableObject.material = Material.create(App.draggableObject.userData.dragMaterial);
    }
  }
  function stop() {
    App.controls.OrbitControls.enabled = true;
    App.actions.isDragging = false;
    App.canvas.style.cursor = "auto";
    if (App.draggableObject) {
      let onDragStopCallback = App.draggableObject.userData?.callbacks?.onDragStop ?? (() => {
      });
      if (typeof App.draggableObject.userData?.callbacks?.onDragStop === "string") {
        onDragStopCallback = new Function("return " + App.draggableObject.userData.callbacks.onDragStop)();
      }
      onDragStopCallback(App);
    }
    if (App.draggableObject && App.draggableObject.userData.dragMaterial) {
      App.draggableObject.material = tmpMaterial;
      tmpMaterial = null;
    }
    App.draggableObject = null;
  }
  function drag() {
    const THREE = App.THREE;
    if (!App.actions.isDragging) {
      return;
    }
    App.raycaster.ray.intersectPlane(plane, pointIntersect);
    const newPosition = new THREE.Vector3().addVectors(pointIntersect, distance);
    App.draggableObject.position.copy(newPosition);
    App.draggableObject.updateMatrixWorld(true);
    if (App.movingLimits !== null) {
      const size = App.draggableObject.userData.tmp.size;
      const worldPosition = new THREE.Vector3();
      App.draggableObject.getWorldPosition(worldPosition);
      const isOutOfBounds = worldPosition.x < App.movingLimits.min.x + size.x / 2 || worldPosition.x > App.movingLimits.max.x - size.x / 2 || worldPosition.z < App.movingLimits.min.z + size.z / 2 || worldPosition.z > App.movingLimits.max.z - size.z / 2;
      if (isOutOfBounds) {
        worldPosition.x = Math.max(
          App.movingLimits.min.x + size.x / 2,
          Math.min(App.movingLimits.max.x - size.x / 2, worldPosition.x)
        );
        worldPosition.z = Math.max(
          App.movingLimits.min.z + size.z / 2,
          Math.min(App.movingLimits.max.z - size.z / 2, worldPosition.z)
        );
        const localPosition = App.draggableObject.parent.worldToLocal(worldPosition.clone());
        App.draggableObject.position.copy(localPosition);
      }
    }
    let onDragCallback = App.draggableObject.userData?.callbacks?.onDrag ?? (() => {
    });
    if (typeof App.draggableObject.userData?.callbacks?.onDrag === "string") {
      onDragCallback = new Function("return " + App.draggableObject.userData.callbacks.onDrag)();
    }
    onDragCallback(App);
  }
  ;
  return {
    init,
    start,
    drag,
    stop
  };
}();

// src/modules/events.js
var Events = /* @__PURE__ */ function() {
  async function init() {
    const THREE = App.THREE;
    App.raycaster = App.raycaster ?? new THREE.Raycaster();
    App.mouse = App.mouse ?? {};
    Dragging.init(App.draggables);
    const element = await App.renderer.domElement;
    element.addEventListener("mousemove", (event) => {
      onMouseMove(event);
    });
    element.addEventListener("mousedown", (event) => {
      onMouseDown(event);
    });
    element.addEventListener("mouseup", (event) => {
      onMouseUp(event);
    });
  }
  function onMouseDown(event) {
    Dragging.start();
  }
  function onMouseUp() {
    Dragging.stop();
  }
  function onMouseMove(event) {
    const rect = App.canvas.getBoundingClientRect();
    App.mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
    App.mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    App.raycaster.setFromCamera(App.mouse, App.camera);
    Dragging.drag();
  }
  return {
    init
  };
}();

// src/modules/collisions.js
var Collision = /* @__PURE__ */ function() {
  const currentCollisions = [];
  function check(object, onlyVisible = true) {
    const THREE = App.THREE;
    let collision = false;
    const objectBox = new THREE.Box3().setFromObject(object);
    currentCollisions.length = 0;
    App.collidables.forEach((collidable) => {
      if (collidable === object) {
        return;
      }
      if (onlyVisible && !collidable.visible) {
        return;
      }
      const collidableBox = new THREE.Box3().setFromObject(collidable);
      if (objectBox.intersectsBox(collidableBox)) {
        currentCollisions.push(collidable);
        collision = true;
      }
    });
    return collision;
  }
  function getCurrentCollisions() {
    return currentCollisions;
  }
  return {
    check,
    getCurrentCollisions
  };
}(App);

// src/klee.js
console.log("klee.js: " + KLEEVERSION);
export {
  App,
  Collision,
  Controls,
  Dragging,
  Events,
  Geometry,
  Item,
  KLEEVERSION,
  Light,
  Loaders,
  Material,
  Object3d,
  Scene,
  UserData
};
