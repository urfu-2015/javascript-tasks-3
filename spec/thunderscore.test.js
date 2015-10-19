import assert from 'assert';
import * as _ from '../src/thunderscore';

describe('thunderscore', () => {

    describe('limit', () => {
        it('correct handle  negative params', ()  => {
            assert.equal(_.limit(-1e4, [1, 2, 3, 5]).length, 0);
        });
    });

    describe('sortBy', () => {
        it('sort desc', ()  => {
            let collection = [{a:1},{a:2},{a:3}];
            const [a1,a2,a3] = collection;
            assert.deepEqual(_.sortBy('a', 'desc', collection), [a3,a2,a1]);

            collection = [a2,a1,a3];
            assert.deepEqual(_.sortBy('a', 'desc', collection), [a3,a2,a1]);

            collection = [a3,a2,a1];
            assert.deepEqual(_.sortBy('a', 'desc', collection), [a3,a2,a1]);
        });
    });

    describe('select', () => {
        it('do not select undef fields', ()  => {
            let obj = {a:1, b:2, c: undefined};

            assert.deepEqual(_.select(['a', 'e', 'c'], obj), {a:1});


        });
    })

});
