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
			const size = App.draggableObject.userData.tmp.size;

			// Get the current world position after the initial move
			const worldPosition = new THREE.Vector3();
			App.draggableObject.getWorldPosition(worldPosition);

			// Apply limits in world space
			const isOutOfBounds =
				worldPosition.x < (App.movingLimits.min.x + size.x / 2) ||
				worldPosition.x > (App.movingLimits.max.x - size.x / 2) ||
				worldPosition.z < (App.movingLimits.min.z + size.z / 2) ||
				worldPosition.z > (App.movingLimits.max.z - size.z / 2);

			if (isOutOfBounds) {
				// Clamp the world position
				worldPosition.x = Math.max(
					App.movingLimits.min.x + size.x / 2,
					Math.min(App.movingLimits.max.x - size.x / 2, worldPosition.x),
				);
				worldPosition.z = Math.max(
					App.movingLimits.min.z + size.z / 2,
					Math.min(App.movingLimits.max.z - size.z / 2, worldPosition.z)
				);

				// Convert world position to local position
				// This automatically handles any nested groups
				const localPosition = App.draggableObject.parent.worldToLocal(worldPosition.clone());

				// Apply the corrected position
				App.draggableObject.position.copy(localPosition);
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
