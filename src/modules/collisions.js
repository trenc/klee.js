import { App } from './app';

const Collision = (function () {

	function check (object) {

		const THREE = App.THREE;

		let collision = null;

		const objectBox = new THREE.Box3().setFromObject(object);

		App.collidables.forEach(collidable => {

			if (collidable === object && collidable.visible === false) {

				return;

			}

			const collidableBox = new THREE.Box3().setFromObject(collidable);

			if (objectBox.intersectsBox(collidableBox)) {

				collision = collidable;

			}

		});

		return collision;

	}

	return {

		check: check

	};

})(App);

export { Collision };
