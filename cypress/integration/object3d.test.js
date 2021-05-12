describe('KLEE Object3d', function () {

	describe('add (options)', function () {

		it('should add one THREE Object3d to the scene', () => {

			cy.visit('/test.html?test=initScene');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testName = 'This-Is-Test-Grid';
				const gridOptions = {
					type: 'GridHelper',
					args: [100, 100],
					properties: {
						name: testName,
						color: '#72898f'
					}
				};

				KLEE.Object3d.add(gridOptions);
				const addedObject3d = KLEE.App.scene.getObjectByName(testName);

				expect(addedObject3d).to.be.ok;
				expect(addedObject3d).to.be.an.instanceof(THREE.GridHelper);

			});

		});

	});

	describe('create (options)', function () {

		it('should create a THREE Object3d', () => {

			cy.visit('/test.html?test=initScene');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testName = 'This-Is-Test-Grid';
				const gridOptions = {
					type: 'GridHelper',
					args: [100, 100],
					properties: {
						name: testName,
						color: '#72898f'
					}
				};

				const grid = KLEE.Object3d.create(gridOptions);

				expect(grid.name).to.be.equal(testName);
				expect(grid).to.be.an.instanceof(THREE.GridHelper);

			});

		});

	});

	describe('change (object3d, options)', function () {

		it('should change the properties of a THREE Object3d', () => {

			cy.visit('/test.html?test=initScene');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testName = 'This-Is-Test-Grid';
				const gridOptions = {
					type: 'GridHelper',
					args: [100, 100],
					properties: {
						name: testName,
						color: '#72898f'
					}
				};

				const testName2 = 'This-Is-Test-Grid-2';
				const changedOptions = {
					properties: { name: testName2 }
				};
				const grid = KLEE.Object3d.create(gridOptions);

				KLEE.Object3d.change(grid, changedOptions);

				expect(grid.name).to.be.equal(testName2);
				expect(grid.name).not.to.be.equal(testName);
				expect(grid).to.be.an.instanceof(THREE.GridHelper);

			});

		});

	});

});
