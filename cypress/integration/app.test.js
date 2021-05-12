import { getDefaultOptions } from '../../src/default.options.js';

describe('KLEE app', function () {

	describe('init (THREE, options)', function () {

		context('when no THREE is given', function () {

			it('should throw an error', () => {

				cy.visit('/test.html');

				cy.window().then(win => {

					const KLEE = win.KLEE;

					expect(() => KLEE.App.init()).to.throw();
					expect(() => KLEE.App.init(2)).to.throw();
					expect(() => KLEE.App.init('some-string')).to.throw();

				});

			});

		});

		context('otherwise', function () {

			it('should create a THREE.WebGLRenderer with options and/or default options', () => {

				cy.visit('/test.html?test=initOptions');

				cy.window().then(win => {

					const KLEE = win.KLEE;
					const options = win.KleeOptions;
					const THREE = KLEE.App.THREE;

					const defaultOptions = getDefaultOptions(THREE);
					const defaultRendererElement = defaultOptions.renderer.domElement;
					const optionsShadows = options.renderer.properties.shadowMap.enabled;

					const renderer = KLEE.App.renderer;
					const rendererElement = renderer.domElement.parentElement.localName;
					const rendererShadows = renderer.shadowMap.enabled;

					expect(renderer).to.be.an.instanceof(THREE.WebGLRenderer);
					expect(rendererElement).to.be.equal(defaultRendererElement);
					expect(rendererShadows).to.be.equal(optionsShadows);

				});

			});

		});

	});

	describe('create (options)', function () {

		it('should create a THREE object width a THREE method and some args', () => {

			cy.visit('/test.html?test=initScene');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = KLEE.App.THREE;

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

	});

	describe('initSize ()', function () {

		it('it should set the size of the renderer and the camera aspect', () => {

			cy.visit('/test.html?test=initScene');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = KLEE.App.THREE;
				const renderer = KLEE.App.renderer;
				const canvas = win.document.querySelector('canvas');
				const initialWidth = canvas.width;
				const initialHeight = canvas.height;
				const changeFactor = 1.25;
				const initialAspect = KLEE.App.camera.aspect;
				const initialV2 = new THREE.Vector2();
				renderer.getSize(initialV2);

				canvas.style.width = initialWidth * changeFactor + 'px';
				canvas.style.height = initialHeight * changeFactor + 'px';
				canvas.width = initialWidth * changeFactor;
				canvas.height = initialHeight * changeFactor;
				KLEE.App.initSize();
				const resizedV2 = new THREE.Vector2();
				renderer.getSize(resizedV2);
				const resizedAspect = KLEE.App.camera.aspect;

				expect(initialV2.x).to.be.eql(initialWidth);
				expect(initialV2.y).to.be.eql(initialHeight);
				expect(initialAspect).to.be.eql(initialV2.x / initialV2.y);
				expect(resizedV2.x).to.be.eql(initialWidth * changeFactor);
				expect(resizedV2.y).to.be.eql(initialHeight * changeFactor);
				expect(resizedAspect).to.be.eql(resizedV2.x / resizedV2.y);
				expect(resizedV2.x).not.to.be.eql(initialWidth);

			});

		});

	});

	describe('run (callback)', function () {

		it('it sets the requestAnimationFrame and runs an optional callback inside', () => {

			cy.visit('/test.html?test=initScene');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const returnValue = '123';
				const obj = {
					myFunction () {

						return '123';

					}
				};
				const requestAnimationFrame = cy.spy(win, 'requestAnimationFrame');
				const myFunction = cy.spy(obj, 'myFunction');

				KLEE.App.run(() => obj.myFunction());

				expect(requestAnimationFrame).to.have.been.called;
				expect(myFunction.returnValues[0]).to.be.eql(returnValue);

			});

		});

	});

	describe('show error(message), warn(message), info(message) an log(message) depending on debugLevels', function () {

		beforeEach(() => {

			cy.visit('/test.html', {

				onBeforeLoad (win) {

					cy.stub(win.console, 'warn').as('consoleWarn');
					cy.stub(win.console, 'info').as('consoleInfo');
					cy.stub(win.console, 'log').as('consoleLog');

				}

			});

		});

		const errorMessage = 'Error message Error';
		const warnMessage = 'Warn message Warn';
		const logMessage = 'Log message Log';
		const infoMessage = 'Info message Info';

		it('debugLevel 0 throws only error (message)', () => {

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;

				KLEE.App.init(THREE, { debugLevel: 0 });
				KLEE.App.warn(warnMessage);
				KLEE.App.log(logMessage);
				KLEE.App.info(infoMessage);

				expect(() => KLEE.App.error(errorMessage)).to.throw(errorMessage);
				cy.get('@consoleWarn').should('not.be.calledWith', warnMessage);
				cy.get('@consoleLog').should('not.be.calledWith', logMessage);
				cy.get('@consoleInfo').should('not.be.calledWith', infoMessage);

			});

		});

		it('debugLevel 1 throws error (message) and shows warn (message)', () => {

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;

				KLEE.App.init(THREE, { debugLevel: 1 });
				KLEE.App.warn(warnMessage);
				KLEE.App.log(logMessage);
				KLEE.App.info(infoMessage);

				expect(() => KLEE.App.error(errorMessage)).to.throw(errorMessage);
				cy.get('@consoleWarn').should('be.calledWith', warnMessage);
				cy.get('@consoleLog').should('not.be.calledWith', logMessage);
				cy.get('@consoleInfo').should('not.be.calledWith', infoMessage);

			});

		});

		it('debugLevel 2 throws error (message) and shows warn (message) and log (message)', () => {

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;

				KLEE.App.init(THREE, { debugLevel: 2 });
				KLEE.App.warn(warnMessage);
				KLEE.App.log(logMessage);
				KLEE.App.info(infoMessage);

				expect(() => KLEE.App.error(errorMessage)).to.throw(errorMessage);
				cy.get('@consoleWarn').should('be.calledWith', warnMessage);
				cy.get('@consoleLog').should('be.calledWith', logMessage);
				cy.get('@consoleInfo').should('not.be.calledWith', infoMessage);

			});

		});

		it('debugLevel 3 throws error (message) and shows warn (message), log (message) and info (mesage)', () => {

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;

				KLEE.App.init(THREE, { debugLevel: 3 });
				KLEE.App.warn(warnMessage);
				KLEE.App.log(logMessage);
				KLEE.App.info(infoMessage);

				expect(() => KLEE.App.error(errorMessage)).to.throw(errorMessage);
				cy.get('@consoleWarn').should('be.calledWith', warnMessage);
				cy.get('@consoleLog').should('be.calledWith', logMessage);
				cy.get('@consoleInfo').should('be.calledWith', infoMessage);

			});

		});

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
