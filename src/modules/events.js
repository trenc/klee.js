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

		const rect = App.canvasRect;
		const offsetX = App.canvas.offsetLeft;
		const offsetY = App.canvas.offsetTop;

		console.log(event.clientX);
		App.mouse.x = ((event.clientX - offsetX - rect.left) / (rect.right - rect.left + offsetX)) * 2 - 1;
		App.mouse.y = -((event.clientY - offsetY - rect.top) / (rect.bottom - rect.top + offsetY)) * 2 + 1;

		App.raycaster.setFromCamera(App.mouse, App.camera);

		Dragging.drag();

	}

	return {

		init: init

	};

})();

export { Events };
