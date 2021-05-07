import * as THREE from '../../example/jsm/three.module.js';
import { getDefaultOptions } from '../../src/default.options.js';
import * as KLEE from '../../dist/klee.js';

describe('KLEE app', function () {

	describe('init (THREE, options)', function () {

		it('should create a THREE.WebGLRenderer with options and/or default options', () => {

			const defaultOptions = getDefaultOptions(THREE);
			const defaultRendererElement = defaultOptions.renderer.domElement;
			const options = { renderer: { properties: { shadowMap: { enabled: false } } } };
			const optionsShadows = options.renderer.properties.shadowMap.enabled;

			KLEE.App.init(THREE, options);
			const renderer = KLEE.App.renderer;
			const rendererElement = renderer.domElement.parentElement.localName;
			const rendererShadows = renderer.shadowMap.enabled;

			expect(renderer).to.be.an.instanceof(THREE.WebGLRenderer);
			expect(rendererElement).to.be.equal(defaultRendererElement);
			expect(rendererShadows).to.be.equal(optionsShadows);

			renderer.dispose();

		});

		it('throws an error, when no THREE is given', () => {

			expect(() => KLEE.App.init()).to.throw();
			expect(() => KLEE.App.init(2)).to.throw();
			expect(() => KLEE.App.init('some-string')).to.throw();

		});

	});

	describe('create (options)', function () {

		it('should create a THREE object width a THREE method and some args', () => {

			const material = {
				type: 'MeshBasicMaterial',
				args: [{ color: 0x00ff00 }]
			};
			const materialColor = new THREE.Color(material.args[0].color);

			const materialObject = KLEE.App.create(material);

			expect(materialObject.color).to.be.eql(materialColor);
			expect(materialObject).to.be.an.instanceof(THREE.MeshBasicMaterial);

		});

	});

	describe('initSize ()', function () {

		it('it should set the size of the renderer and the camera aspect');

	});

	describe('run (callback)', function () {

		it('it sets the requestAnimationFrame and runs an optional callback inside');

	});

	describe('error (message)', function () {

		it('throws and error with arguments message', () => {

			const message = 'Error message';

			expect(() => KLEE.App.error(message)).to.throw(message);

		});

	});

	describe('warn (message)', function () {

		it('shows a warning in console with message if debugLevel > 0');

	});

	describe('log (message)', function () {

		it('shows log in console with message if debugLevel > 1');

	});

	describe('info (message)', function () {

		it('shows info in console with message if debugLevel > 2');

	});

	describe('setter', function () {

		it('scene, set the THREE.Scene');
		it('camera, set the THREE.Camera');
		it('controls, set the THREE.Controls');

	});

	describe('getter', function () {

		it('options, returns the options set from init');
		it('THREE, returns the THREE module set from init');
		it('scene, returns the generated THREE.Scene');
		it('camera, returns the generated THREE.Camera');
		it('controls, returns the generated THREE.Controls');
		it('renderer, returns the generated THREE.Renderer');

	});

});
