import * as utils from './validation';

describe('validateStartFrom', () => {
    const fn = utils.validateStartFrom;
    it('should return the same object if from or totalresults is not provided or not a number', () => {
        const obj = { from: 'e', totalResults: 'ten'}
        expect(fn(obj)).toEqual(obj);
    });
    it('should return the same object is from is less than totalresults', () => {
        const obj = {from: 40, totalResults: 60};
        expect(fn(obj)).toEqual(obj);
    });
    it('should return the same object with the from set to 0 if from is bigger than total results', () => {
        const obj = {from: 40, totalResults: 25};
        expect(fn(obj)).toEqual({from: 0, totalResults: 25});
    });
})

describe('addFromParamIfNoneFound()', () => {
    const fn = utils.addFromParamIfNoneFound;
    const params = { from: 0, size: 20, q: 'pop'};

    it('should return the params object unchanged when from key exists', () => {
        expect(fn(params)).toEqual(params);
    })
    it('should return the params object with an additional from property set to zero if not initially found', () => {
        const incomplete = {size: 20, q: 'pop'};
        expect(fn(incomplete)).toEqual(params);
    })
});

describe('validateSearchRequest()', () => {
    it('should pass the object through all valid search utilities', () => {
        const params = {
            poop: 'Rainbow'
        }
        const expectedResult = Object.assign(params, { from: ''})
        const result = utils.validateSearchRequest(params)
        expect(result).toEqual(expectedResult);
    })
});