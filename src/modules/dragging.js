import { App } from './app';
import { Material } from './material';

const Dragging = (function () {

	let tmpMaterial = null;
	let plane = null;
	let planeNormal = null;
	let pointIntersect = null;
	let distance = null;
	let draggableObject = null;
	let draggables = [];

	function init (draggablesArray) {

		const THREE = App.THREE;

		plane = new THREE.Plane();
		planeNormal = new THREE.Vector3(0, 1, 0);
		pointIntersect = new THREE.Vector3();
		distance = new THREE.Vector3();
		draggables = draggablesArray;

	}

	function start () {

		const intersects = App.raycaster.intersectObjects(draggables);

		if (intersects.length <= 0) {

			return;

		}

		pointIntersect.copy(intersects[0].point);

		plane.setFromNormalAndCoplanarPoint(planeNormal, pointIntersect);

		distance.subVectors(intersects[0].object.position, intersects[0].point);

		draggableObject = intersects[0].object;

		App.controls.OrbitControls.enabled = false;

		App.actions.isDragging = true;

		App.canvas.style.cursor = 'grab';

		if (draggableObject.userData.dragMaterial) {

			tmpMaterial = draggableObject.material;

			draggableObject.material = Material.create(draggableObject.userData.dragMaterial);

		}

	}

	function stop () {

		App.controls.OrbitControls.enabled = true;

		App.actions.isDragging = false;

		App.canvas.style.cursor = 'auto';

		if (draggableObject.userData.dragMaterial) {

			draggableObject.material = tmpMaterial;

			tmpMaterial = null;

		}

		draggableObject = null;

	}

	function drag () {

		if (App.actions.isDragging) {

			draggableObject.position.addVectors(pointIntersect, distance);

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
