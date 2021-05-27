describe('KLEE item', function () {

	describe('add (options)', function () {

		it('should add one or more items/meshs to the scene', () => {

			cy.visit('/test.html?test=SceneInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testNameProperty = 'This-Is-Test-Item';
				const testNameProperty2 = 'This-Is-Test-Item2';
				const options = [
					{
						geometry: {
							type: 'BoxGeometry',
							args: [1, 1, 1]
						},
						material: {
							type: 'MeshBasicMaterial',
							properties: {
								color: 0xff0000
							}
						},
						properties: {
							name: testNameProperty
						}
					},
					{
						geometry: {
							type: 'SphereGeometry',
							args: [5, 32, 32]
						},
						material: {
							type: 'MeshPhongMaterial',
							properties: {
								color: 0x00ff00
							}
						},
						properties: {
							name: testNameProperty2
						}
					}
				];

				KLEE.Item.add(options);
				const addedItem = KLEE.App.scene.getObjectByName(testNameProperty);
				const addedItem2 = KLEE.App.scene.getObjectByName(testNameProperty2);

				expect(addedItem).to.be.an.instanceof(THREE.Mesh);
				expect(addedItem.geometry).to.be.an.instanceof(THREE.BoxGeometry);
				expect(addedItem.material).to.be.an.instanceof(THREE.MeshBasicMaterial);
				expect(addedItem2).to.be.an.instanceof(THREE.Mesh);
				expect(addedItem2.geometry).to.be.an.instanceof(THREE.SphereGeometry);
				expect(addedItem2.material).to.be.an.instanceof(THREE.MeshPhongMaterial);

			});

		});

	});

	describe('create (options)', function () {

		it('should create a items/mesh', () => {

			cy.visit('/test.html?test=SceneInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testNameProperty = 'This-Is-Test-Box';
				const options = {
					geometry: {
						type: 'BoxGeometry',
						args: [1, 1, 1]
					},
					material: {
						type: 'MeshBasicMaterial',
						properties: {
							color: 0xff0000
						}
					},
					properties: {
						name: testNameProperty
					}
				};

				const item = KLEE.Item.create(options);

				expect(item.name).to.be.equal(testNameProperty);
				expect(item).to.be.an.instanceof(THREE.Mesh);
				expect(item.geometry).to.be.an.instanceof(THREE.BoxGeometry);
				expect(item.material).to.be.an.instanceof(THREE.MeshBasicMaterial);

			});

		});

	});

	describe('change (item, options)', function () {

		it('should change the properties of an item/mesh', () => {

			cy.visit('/test.html?test=SceneInit');

			cy.window().then(win => {

				const KLEE = win.KLEE;
				const THREE = win.THREE;
				const testNameProperty = 'This-Is-Test-Box';
				const testNameProperty2 = 'This-Is-Test-Box2';
				const options = {
					geometry: {
						type: 'BoxGeometry',
						args: [1, 1, 1]
					},
					material: {
						type: 'MeshBasicMaterial',
						properties: {
							color: 0xff0000
						}
					},
					properties: {
						name: testNameProperty
					}
				};
				const changedOptions = {
					properties: { name: testNameProperty2 },
					material: {
						properties: {
							color: 0x00ff00
						}
					}
				};
				const item = KLEE.Item.create(options);

				KLEE.Item.change(item, changedOptions);

				expect(item).to.be.an.instanceof(THREE.Mesh);
				expect(item.name).to.be.equal(testNameProperty2);
				expect(item.name).not.to.be.equal(testNameProperty);
				expect(item.material.color.r).not.to.be.eql(1);
				expect(item.material.color.g).to.be.eql(1);

			});

		});

	});

});
