
import { describe, it, suite, test } from 'mocha';
import { assert } from 'chai';
import { http, get } from 'http';

/*
 * Initial ytest for mocha
 */
suite(`initial test `, () => {
    test(`should return true when the string is hello world `, () => {
        let str = `hello world`;
        assert.equal(`hello world`, str);
    });
});


/*
 * Testing the server with http
 */
suite(`test mocha with http`, () => {
    test(`should return OK 200 is the port is 3000`, (done) => {
        get(`http://localhost:3000`, (res) => {
            assert.equal(200, res.statusCode)
            done();
        });
    });
});

/*
 * Test the index file if served
 */
suite(`Test the content`, () => {
    test(`the body content shold be the same as  `, (done) => {
        get(`http://localhost:3000/index`, (res) => {
            let data = ``;
            res.on(`data`, (chunk) => {
                data += chunk;
            });
            res.on(`end`, () => {
                assert.isTrue(data.length > 0);
                done();
            });

        });
    });
});


