import * as THREE from '../example/jsm/three.module.js';
// import { getDefaultOptions } from '../src/default.options.js';
import * as KLEE from '../dist/klee.js';

const expect = chai.expect;

describe('KLEE light', function () {

	describe('add (options)', function () {

		it('should add one or more THREE light objects to the scene');

	});

	describe('create (options)', function () {

		it('should create a THREE light object', () => {

			const testNameProperty = 'This-Is-Test-DirectionalLight';
			const options = {
				type: 'DirectionalLight',
				properties: { name: testNameProperty }
			};

			const light = KLEE.Light.create(options);

			expect(light.name).to.be.equal(testNameProperty);
			expect(light).to.be.an.instanceof(THREE.DirectionalLight);

		});

	});

	describe('change (light, options)', function () {

		it('should chane the properties of a THREE light object');

	});

});
