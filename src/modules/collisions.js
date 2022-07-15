import { App } from './app';

const Collision = (function () {

	function check (object) {

		const THREE = App.THREE;

		let collision = false;

		const objectBox = new THREE.Box3().setFromObject(object);

		App.collidables.forEach(collidable => {

			if (collidable === object) {

				return;

			}

			const collidableBox = new THREE.Box3().setFromObject(collidable);

			if (objectBox.intersectsBox(collidableBox)) {

				collision = true;

			}

		});

		return collision;

	}

	return {

		check: check

	};

})(App);

export { Collision };
