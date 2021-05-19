describe('KLEE controls', function () {

	describe('init ()', function () {

		it('should init Controls (OrbitControls)', () => {

			cy.visit('/test.html?test=SceneInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const OrbitControls = win.OrbitControls;
				const controls = {
					properties: {
						autoRotate: true
					}
				};

				KLEE.Controls.init(OrbitControls, controls);

				expect(KLEE.App.controls).to.be.instanceof(OrbitControls);
				expect(KLEE.App.controls.autoRotate).to.be.true;

			});

		});

	});

});
