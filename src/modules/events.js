import { App } from './app';

const Events = (function () {

	function init () {

		const THREE = App.THREE;

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

	function onMouseDown (event) {

		const intersects = App.raycaster.intersectObjects(App.draggables);

    if (intersects.length <= 0) {

    	return;

    }

    App.controls.OrbitControls.enabled = false;

    	// pIntersect.copy(intersects[0].point);

      // plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);

      // shift.subVectors(intersects[0].object.position, intersects[0].point);

      // isDragging = true;

      // dragObject = intersects[0].object;

	}

	function onMouseUp (event) {

    App.controls.OrbitControls.enabled = true;

	}

	function onMouseMove (event) {

		App.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		App.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		App.raycaster.setFromCamera(App.mouse, App.camera);

	}

	return {

		init: init

	}

})();

export { Events };
