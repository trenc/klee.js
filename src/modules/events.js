import { App } from './app';
import { Dragging } from './dragging';

const Events = (function () {

	function init () {

		const THREE = App.THREE;

		App.raycaster = App.raycaster ?? new THREE.Raycaster();
		App.mouse = App.mouse ?? {};

		Dragging.init(App.draggables);

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

		Dragging.start();

	}

	function onMouseUp () {

		Dragging.stop();

	}

	function onMouseMove (event) {

		App.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		App.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		App.raycaster.setFromCamera(App.mouse, App.camera);

		Dragging.drag();

	}

	return {

		init: init

	};

})();

export { Events };
