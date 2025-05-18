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

	function start (object = null, intersects = null) {
		const THREE = App.THREE;

		intersects = intersects ?? (object
			? App.raycaster.intersectObject(object, true)
			: App.raycaster.intersectObjects(App.draggables, true));

		if (intersects.length <= 0) return;

		App.draggableObject = object ?? intersects[0].object;

		pointIntersect.copy(intersects[0].point);

		plane.setFromNormalAndCoplanarPoint(planeNormal, pointIntersect);

		distance.subVectors(App.draggableObject.position, intersects[0].point);

		// create boundingBox and size for later use
		const bBox = new THREE.Box3().setFromObject(App.draggableObject);
		const size = new THREE.Vector3();
		bBox.getSize(size);

		App.draggableObject.userData.tmp = {
			bbox: bBox,
			size
		};

		App.controls.OrbitControls.enabled = false;
		App.actions.isDragging = true;
		App.canvas.style.cursor = 'grab';

		// onDragStart callback
		let onDragStartCallback = App.draggableObject.userData?.callbacks?.onDragStart ?? (() => {});

		// create a function if it is a string
		if (typeof App.draggableObject.userData?.callbacks?.onDragStart === 'string') {
			/* eslint-disable no-new-func */
			onDragStartCallback = new Function('return ' + App.draggableObject.userData.callbacks.onDragStart)();
			/* eslint-enable no-new-func */
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
			/* eslint-disable no-new-func */
				onDragStopCallback = new Function('return ' + App.draggableObject.userData.callbacks.onDragStop)();
			/* eslint-enable no-new-func */
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

		// Update the intersection point
		App.raycaster.ray.intersectPlane(plane, pointIntersect);

		// Calculate the intended new position
		const newPosition = new THREE.Vector3().addVectors(pointIntersect, distance);
		App.draggableObject.position.copy(newPosition);

		// Update the world matrix to reflect the new position
		App.draggableObject.updateMatrixWorld(true);

		if (App.movingLimits !== null) {
			// Recalculate the world-space bounding box
			const bbox = new THREE.Box3().setFromObject(App.draggableObject);

			const delta = new THREE.Vector3(); // To store any correction needed

			// Check and correct min/max X
			if (bbox.min.x < App.movingLimits.min.x) {
				delta.x = App.movingLimits.min.x - bbox.min.x;
			} else if (bbox.max.x > App.movingLimits.max.x) {
				delta.x = App.movingLimits.max.x - bbox.max.x;
			}

			// Check and correct min/max Z
			if (bbox.min.z < App.movingLimits.min.z) {
				delta.z = App.movingLimits.min.z - bbox.min.z;
			} else if (bbox.max.z > App.movingLimits.max.z) {
				delta.z = App.movingLimits.max.z - bbox.max.z;
			}

			// If any correction is needed, apply it
			if (!delta.equals(new THREE.Vector3())) {
				// Convert delta (world space) to local space
				const localDelta = App.draggableObject.parent.worldToLocal(
					App.draggableObject.getWorldPosition(new THREE.Vector3()).add(delta)
				).sub(App.draggableObject.position);

				App.draggableObject.position.add(localDelta);
			}
		}

		// onDrag callback
		let onDragCallback = App.draggableObject.userData?.callbacks?.onDrag ?? (() => {});
		if (typeof App.draggableObject.userData?.callbacks?.onDrag === 'string') {
			/* eslint-disable no-new-func */
			onDragCallback = new Function('return ' + App.draggableObject.userData.callbacks.onDrag)();
			/* eslint-enable no-new-func */
		}

		onDragCallback(App);
	};

	return {
		init,
		start,
		drag,
		stop
	};
})();

export { Dragging };
