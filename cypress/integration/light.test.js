describe('KLEE light', function () {

	describe('add (options)', function () {

		it('should add one or more THREE light objects to the scene', () => {

			cy.visit('/test.html?test=SceneInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testNameProperty = 'This-Is-Test-DirectionalLight';
				const options = {
					type: 'DirectionalLight',
					properties: { name: testNameProperty }
				};
				KLEE.Light.add(options);
				const addedLight = KLEE.App.scene.getObjectByName(testNameProperty);

				expect(addedLight).to.be.an.instanceof(THREE.DirectionalLight);

			});

		});

	});

	describe('create (options)', function () {

		it('should create a THREE light object', () => {

			cy.visit('/test.html?test=SceneInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
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

	});

	describe('change (light, options)', function () {

		it('should change the properties of a THREE light object', () => {

			cy.visit('/test.html?test=SceneInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testNameProperty = 'This-Is-Test-DirectionalLight';
				const testNameProperty2 = 'This-Is-Test-DirectionalLight2';
				const options = {
					type: 'DirectionalLight',
					properties: { name: testNameProperty }
				};
				const changedOptions = {
					properties: { name: testNameProperty2 }
				};
				const light = KLEE.Light.create(options);

				KLEE.Light.change(light, changedOptions);

				expect(light.name).to.be.equal(testNameProperty2);
				expect(light.name).not.to.be.equal(testNameProperty);
				expect(light).to.be.an.instanceof(THREE.DirectionalLight);

			});

		});

	});

});
