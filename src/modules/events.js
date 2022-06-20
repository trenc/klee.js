import { App } from './app';
import { Dragging } from './dragging';

const Events = (function () {

	let rect;

	async function init () {

		const THREE = App.THREE;

		App.raycaster = App.raycaster ?? new THREE.Raycaster();
		App.mouse = App.mouse ?? {};

		Dragging.init(App.draggables);

		const element = await App.renderer.domElement;

		rect = element.getBoundingClientRect();

		 element.addEventListener('mousemove', event => {

			onMouseMove(event);

		});

		element.addEventListener('mousedown', event => {

			onMouseDown(event);

		});

		element.addEventListener('mouseup', event => {

			onMouseUp(event);

		});

	}

	function onMouseDown (event) {

		if (event.button !== 0) {

			return false;

		}

		Dragging.start();

	}

	function onMouseUp () {

		Dragging.stop();

	}

	function onMouseMove (event) {

		App.mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
		App.mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

		App.raycaster.setFromCamera(App.mouse, App.camera);

		if (event.button !== 0) {

			return false;

		}

		Dragging.drag();

	}

	return {

		init: init

	};

})();

export { Events };
