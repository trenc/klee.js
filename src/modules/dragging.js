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

		const intersects = App.raycaster.intersectObjects(App.draggables);

		if (intersects.length <= 0) {

			return;

		}

		pointIntersect.copy(intersects[0].point);

		plane.setFromNormalAndCoplanarPoint(planeNormal, pointIntersect);

		distance.subVectors(intersects[0].object.position, intersects[0].point);

		App.draggableObject = intersects[0].object;

		App.controls.OrbitControls.enabled = false;

		App.actions.isDragging = true;

		App.canvas.style.cursor = 'grab';

		// onDragStart callback
    let  onDragStartCallback = App.draggableObject.userData?.callbacks?.onDragStart ?? (() => {});

		// run eval if it is a string
    if (typeof App.draggableObject.userData?.callbacks?.onDragStart === 'string') {

      onDragStartCallback = eval(App.draggableObject.userData.callbacks.onDragStart);

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

			// run eval if it is a cenverted function string
      if (typeof App.draggableObject.userData?.callbacks?.onDragStop === 'string') {

        onDragStopCallback = eval(App.draggableObject.userData.callbacks.onDragStop);

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

		if (App.actions.isDragging) {

			App.draggableObject.position.addVectors(pointIntersect, distance);

			if (App.movingLimits !== null) {

				App.movingLimits.min.y = App.draggableObject.position.y;
				App.movingLimits.max.y = App.draggableObject.position.y;
				App.draggableObject.position.clamp(App.movingLimits.min, App.movingLimits.max);

			}

			App.raycaster.ray.intersectPlane(plane, pointIntersect);

		}

	}

	return {

		init: init,
		start: start,
		drag: drag,
		stop: stop

	};

})();

export { Dragging };
