import { Utils } from '../src/utils.js';

const expect = chai.expect;

describe('Utils', function () {

	describe('merge (target, source)', function () {

		it('should return a merge of two nested objects or the target object', () => {

			const target = {
				foo1: 'foo1',
				foo2: {
					foo3: 'foo3'
				}
			};

			const source = {
				bar1: 'bar1',
				foo2: {
					foo3: 'bar3'
				},
				bar4: 'bar4'
			};

			const expectedMerge = {
				foo1: 'foo1',
				foo2: {
					foo3: 'bar3'
				},
				bar1: 'bar1',
				bar4: 'bar4'
			};

			const noSrcResult = Utils.merge(target);
			const result = Utils.merge(target, source);

			expect(JSON.stringify(noSrcResult)).to.equal(JSON.stringify(target));
			expect(JSON.stringify(result)).to.equal(JSON.stringify(expectedMerge));

		});

	});

	describe('isThreeColorValue (string)', function () {

		it('should return true if string is a THREE object property key that has a color value otherwisee false', () => {

			const threeColorValues = [

				'color',
				'specular',
				'emissive',
				'diffuse',
				'background'

			];

			const noColorValues = [

				true,
				{ 'test': 'test' },
				'blue',
				'colors',
				'backgrounds'

			];

			const expectedTruely = [true, true, true, true, true];
			const expectedFalsy = [false, false, false, false, false];

			const trulyResults = threeColorValues.map(color => Utils.isThreeColorValue(color)); 
			const falsyResults = noColorValues.map(color => Utils.isThreeColorValue(color)); 

			expect(trulyResults).to.eql(expectedTruely);
			expect(falsyResults).to.eql(expectedFalsy);

		});

	});

	describe('applyMethods (object, methods)', function () {

		it('should call methods of an object and returns the object', () => {

			class testClass {
				
				constructor () {

					this.result1 = null;
					this.result2 = null;

				}

				method1 (x, y) {

					this.result1 =  x + y;

				}

				method2 () {

					this.result2 = true;

				}

			}

			const testMethods = {

				'method1': [2, 3],
				'method2': [],
				'method3': []

			}

			const testObject = new testClass();

			const resultObject = Utils.applyMethods(testObject, testMethods);
			const result1 = resultObject.result1; 
			const result2 = resultObject.result2; 

			expect(resultObject).to.equal(testObject);
			expect(result1).to.equal(5);
			expect(result2).to.be.true;

		});

	});

});
