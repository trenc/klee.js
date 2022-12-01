import { App } from './app';
import { Material } from './material';

const Dragging = (function () {

	let tmpMaterial = null;
	let plane = null;
	let planeNormal = null;
	let pointIntersect = null;
	let distance = null;

	function init () {

		const THREE = App.THREE;

		plane = new THREE.Plane();
		planeNormal = new THREE.Vector3(0, 1, 0);
		pointIntersect = new THREE.Vector3();
		distance = new THREE.Vector3();

	}

	function start () {

		const THREE = App.THREE;

		const intersects = App.raycaster.intersectObjects(App.draggables);

		if (intersects.length <= 0) {

			return;

		}

		pointIntersect.copy(intersects[0].point);

		plane.setFromNormalAndCoplanarPoint(planeNormal, pointIntersect);

		distance.subVectors(intersects[0].object.position, intersects[0].point);

		App.draggableObject = intersects[0].object;

		// create boundingBox and size for later use
		const bBox = new THREE.Box3().setFromObject(App.draggableObject);
		const size = new THREE.Vector3();
		bBox.getSize(size);

		App.draggableObject.userData.tmp = {
			bbox: bBox,
			size: size
		};

		App.controls.OrbitControls.enabled = false;

		App.actions.isDragging = true;

		App.canvas.style.cursor = 'grab';

		// onDragStart callback
    let  onDragStartCallback = App.draggableObject.userData?.callbacks?.onDragStart ?? (() => {});

		// create a function if it is a string
    if (typeof App.draggableObject.userData?.callbacks?.onDragStart === 'string') {

      onDragStartCallback = new Function('return ' + App.draggableObject.userData.callbacks.onDragStart)();

    }

		onDragStartCallback(App);

		if (App.draggableObject.userData.dragMaterial) {

			tmpMaterial = App.draggableObject.material;

			App.draggableObject.material = Material.create(App.draggableObject.userData.dragMaterial);

		}

	}

	function stop () {

		App.controls.OrbitControls.enabled = true;

		App.actions.isDragging = false;

		App.canvas.style.cursor = 'auto';

		if (App.draggableObject) {

			// onDragStop callback
      let onDragStopCallback = App.draggableObject.userData?.callbacks?.onDragStop ?? (() => {});

			// create function if it is a converted function string
      if (typeof App.draggableObject.userData?.callbacks?.onDragStop === 'string') {

        onDragStopCallback = new Function('return ' + App.draggableObject.userData.callbacks.onDragStop)();

      }

			onDragStopCallback(App);

		}

		if (App.draggableObject && App.draggableObject.userData.dragMaterial) {

			App.draggableObject.material = tmpMaterial;

			tmpMaterial = null;

		}

		App.draggableObject = null;

	}

	function drag () {

		const THREE = App.THREE;

		if (!App.actions.isDragging) {

			return;

		}

		App.draggableObject.position.addVectors(pointIntersect, distance);

		if (App.movingLimits !== null) {

			const limits = {
				min: new THREE.Vector3(),
				max: new THREE.Vector3()
			};

			// fix on y to move on floor
			limits.min.y = App.draggableObject.position.y;
			limits.max.y = App.draggableObject.position.y;

			// substract half width volume to move on edges not center
			const size = App.draggableObject.userData.tmp.size;
			limits.min.x = App.movingLimits.min.x + size.x / 2;
			limits.max.x = App.movingLimits.max.x - size.x / 2;
			limits.min.z = App.movingLimits.min.z + size.z / 2;
			limits.max.z = App.movingLimits.max.z - size.z / 2;

			App.draggableObject.position.clamp(limits.min, limits.max);

		}

		// onDrag callback
    let onDragCallback = App.draggableObject.userData?.callbacks?.onDrag ?? (() => {});

		// create function if it is a converted function string
    if (typeof App.draggableObject.userData?.callbacks?.onDrag === 'string') {

      onDragCallback = new Function('return ' + App.draggableObject.userData.callbacks.onDrag)();

    }

		onDragCallback(App);

		App.raycaster.ray.intersectPlane(plane, pointIntersect);

	}

	return {

		init: init,
		start: start,
		drag: drag,
		stop: stop

	};

})();

export { Dragging };
