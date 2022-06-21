import { App } from './app';
import { Dragging } from './dragging';

const Events = (function () {

	async function init () {

		const THREE = App.THREE;

		App.raycaster = App.raycaster ?? new THREE.Raycaster();
		App.mouse = App.mouse ?? {};

		Dragging.init(App.draggables);

		const element = await App.renderer.domElement;

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

		Dragging.start();

	}

	function onMouseUp () {

		Dragging.stop();

	}

	function onMouseMove (event) {

		const rect = App.canvas.getBoundingClientRect();

		App.mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
		App.mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

		App.raycaster.setFromCamera(App.mouse, App.camera);

		Dragging.drag();

	}

	return {

		init: init

	};

})();

export { Events };
