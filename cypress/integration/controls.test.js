describe('KLEE controls', function () {

	describe('init ()', function () {

		it('should init Controls (OrbitControls)', () => {

			cy.visit('/test.html');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const OrbitControls = win.OrbitControls;
				const controls = {
					properties: {
						autoRotate: true
					}
				};

				KLEE.App.init(THREE, {});
				KLEE.Scene.init();
				KLEE.Controls.init(OrbitControls, controls);

				expect(KLEE.App.controls).to.be.instanceof(OrbitControls);
				expect(KLEE.App.controls.autoRotate).to.be.true;

			});

		});

	});

});
