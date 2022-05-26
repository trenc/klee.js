import { App } from './app';

const Events = (function () {

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

		App.raycaster = App.raycaster ?? new THREE.Raycaster();
		App.mouse = App.mouse ?? {};


		document.addEventListener('mousemove', event => {

			onMouseMove(event);

		});

		document.addEventListener('mousedown', event => {

			onMouseDown(event);

		});

		document.addEventListener('mouseup', event => {

			onMouseUp(event);

		});

	}

	function onMouseDown () {

		const intersects = App.raycaster.intersectObjects(App.draggables);

    if (intersects.length <= 0) {

    	return;

    }

   	pointIntersect.copy(intersects[0].point);

    plane.setFromNormalAndCoplanarPoint(planeNormal, pointIntersect);

		distance.subVectors(intersects[0].object.position, intersects[0].point);

    App.controls.OrbitControls.enabled = false;

		App.actions.isDragging = true;

		App.draggableObject = intersects[0].object;

		App.canvas.style.cursor = 'grab';

	}

	function onMouseUp () {

    App.controls.OrbitControls.enabled = true;

    App.actions.isDragging = false;

		App.draggableObject = null;

		App.canvas.style.cursor = 'auto';

	}

	function onMouseMove (event) {

		App.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		App.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		App.raycaster.setFromCamera(App.mouse, App.camera);

		if (App.actions.isDragging) {

			App.raycaster.ray.intersectPlane(plane, pointIntersect);

      App.draggableObject.position.addVectors(pointIntersect, distance);

    }
	}

	return {

		init: init

	}

})();

export { Events };
