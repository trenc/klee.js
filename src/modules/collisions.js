import { App } from './app';

const Collision = (function () {

	const currentCollisions = [];

	function check (object, onlyVisible = true) {

		const THREE = App.THREE;

		let collision = false;

		const objectBox = new THREE.Box3().setFromObject(object);

		currentCollisions.length = 0;

		App.collidables.forEach(collidable => {

			if (collidable === object) {

				return;

			}

			if (onlyVisible && !collidable.visible) {

				return;

			}

			const collidableBox = new THREE.Box3().setFromObject(collidable);

			if (objectBox.intersectsBox(collidableBox)) {

				currentCollisions.push(collidable);
				collision = true;

			}

		});

		return collision;

	}

	function getCurrentCollisions () {

		return currentCollisions;

	}

	return {

		check: check,
		getCurrentCollisions: getCurrentCollisions

	};

})(App);

export { Collision };
