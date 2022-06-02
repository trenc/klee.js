describe('KLEE material', function () {

	describe('create (options)', function () {

		it('should create a THREE material object', () => {

			cy.visit('/test.html?test=AppInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testNameProperty = 'This-Is-Test-Material';
				const options = {
					type: 'MeshBasicMaterial',
					properties: { name: testNameProperty }
				};

				const material = KLEE.Material.create(options);

				expect(material.name).to.be.equal(testNameProperty);
				expect(material).to.be.an.instanceof(THREE.MeshBasicMaterial);

			});

		});

	});

	describe('change (material, options)', function () {

		it('should change the properties of a THREE material object', () => {

			cy.visit('/test.html?test=SceneInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testNameProperty = 'This-Is-Test-Material';
				const testNameProperty2 = 'This-Is-Test-Material2';
				const options = {
					type: 'MeshBasicMaterial',
					properties: {
						name: testNameProperty,
						color: 0x00ff00
					}
				};
				const changedOptions = {
					properties: {
						name: testNameProperty2,
						color: 0xff0000
					},
					textures: [
						{
							loader: 'TextureLoader',
							map: 'map',
							url: '../../example/textures/Wood060_1K_Color.jpg',
							properties: { flipY: false }
						}
					]
				};
				const material = KLEE.Material.create(options);

				KLEE.Material.change(material, changedOptions);

				expect(material).to.be.an.instanceof(THREE.MeshBasicMaterial);
				expect(material.name).to.be.equal(testNameProperty2);
				expect(material.name).not.to.be.equal(testNameProperty);
				expect(material.color.r).to.be.eql(1);
				expect(material.color.g).to.be.eql(0);
				expect(material.color.b).to.be.eql(0);
				expect(material.name).not.to.be.equal(testNameProperty);
				expect(material.map).to.be.an.instanceof(THREE.Texture);
				expect(material.map.flipY).to.be.false;

			});

		});

	});

});
