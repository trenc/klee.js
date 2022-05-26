import { App } from './app';

const Loaders = (function () {

	const Loaders = {};

	function init (LoaderClass) {

		Loaders[LoaderClass.name] = new LoaderClass();

	}

	function load (options) {

		// ToDo: Preload all assets and file before
		const item = Loaders[options.loader].load(options.file);

		return item;

	}

	return {

		init: init,
		load: load

	};

})(App);

export { Loaders };
