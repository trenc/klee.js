describe('KLEE scene', function () {

	describe('init ()', function () {

		it('should init a THREE scene with and a camera', () => {

			cy.visit('/test.html');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const cameraName = 'test-camera-1';
				const options = {
					camera: {
						type: 'PerspectiveCamera',
						properties: {
							name: cameraName
						}
					}
				};

				KLEE.App.init(THREE, options);
				KLEE.Scene.init();

				expect(KLEE.App.scene).to.be.instanceof(THREE.Scene);
				expect(KLEE.App.camera).to.be.instanceof(THREE.PerspectiveCamera);
				expect(KLEE.App.camera.name).to.be.equal(cameraName);

			});

		});

	});

});
