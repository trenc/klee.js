describe('KLEE geometry', function () {

	describe('create (options)', function () {

		it('should create a THREE geometry', () => {

			cy.visit('/test.html?test=AppInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testNameProperty = 'This-Is-Test-Geometry';
				const options = {
					type: 'BoxGeometry',
					args: [0.7, 0.7, 0.7],
					properties: { name: testNameProperty }
				};

				const geo = KLEE.Geometry.create(options);
				const defaultBox = KLEE.Geometry.create();

				expect(geo.name).to.be.equal(testNameProperty);
				expect(geo.parameters.width).to.be.eql(0.7);
				expect(geo).to.be.an.instanceof(THREE.BoxGeometry);
				expect(defaultBox.parameters.width).to.be.eql(1);
				expect(defaultBox).to.be.an.instanceof(THREE.BoxGeometry);

			});

		});

	});

});
