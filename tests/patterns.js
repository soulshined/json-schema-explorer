import date from "../lib/patterns/date.js";
import duration from "../lib/patterns/duration.js";
import json from '../lib/patterns/json.js';
import uri from '../lib/patterns/uri.js';

const regex = (pattern) => new RegExp(pattern);
const test = (regex, actual, toEqual) => {
    expect(regex.source).not.toEqual("(?:)");
    expect(regex.test(actual)).toEqual(toEqual);
}

describe('DateTime Patterns', function () {

    describe(`[EXPECTED PASS] Date: ${date.DATE}`, function () {
        [
            '2012-02-20'
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(date.DATE), item, true);
            })
        })
    })

    describe(`[EXPECTED PASS] Time: ${date.TIME}`, function () {
        [
            '00:00:00',
            '00:00:00.0',
            '00:00:00.000000'
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(date.TIME), item, true);
            })
        })
    })

    describe(`[EXPECTED PASS] DateTime: ${date.ISO_861}`, function () {
        [
            '2012-02-20t00:00:00Z',
            '2012-02-20T00:00:00Z',
            '2012-02-20T00:00:00.000Z',
            '2012-02-20T00:00:00.000+00:00',
            '2012-02-20T00:00:00.000-00:00',
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(date.ISO_861), item, true);
            })
        })
    })

    describe(`[EXPECTED FAIL] Date: ${date.DATE}`, function () {
        [
            '2012-00-01', //can't have a month starts with 0
            '2012-01-00', //can't have a day starts with 0
            '2012-01-32', //can't have a day over 31
            '2012-02-20T',
            '2012-02-20T00:00:00Z',
            '2012-02-20T00:00:00.000',
            '2012-02-20T00:00:00.000Z',
            '2012-02-20T00:00:00.000+00:00',
            '2012-02-20T00:00:00.000-00:00'
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(date.DATE), item, false);
            })
        })
    })

    describe(`[EXPECTED FAIL] Time: ${date.TIME}`, function () {
        [
            '00:00:00',
            '00:00:00.0',
            '00:00:00.000000'
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(date.TIME), item, true);
            })
        })
    })

    describe(`[EXPECTED FAIL] DateTime: ${date.ISO_861}`, function () {
        [
            '2012-02-20 00:00:00',
            '2012-02-20T00:00:00',
            '2012-02-20T00:00:00.000',
            '2012-02-20T00:00:00.000+0',
            '2012-02-20T00:00:00.000-0',
            '2012-02-20 00:00:00Z',
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(date.ISO_861), item, false);
            })
        })
    })

})

describe('Duration Patterns', function () {
    describe(`[EXPECTED PASS] Duration: ${duration.DURATION}`, function () {
        [
            'PT0S',
            'PT0000S',
            'PT0M',
            'PT000M',
            'PT0M0S',
            'PT000M000S',
            'PT0H',
            'PT000H',
            'PT0H0M',
            'PT0H00M',
            'PT00H00M',
            'PT0H0M0S',
            'PT00H00M00S',
            'P0D',
            'P00D',
            'P0DT0S',
            'P0DT00S',
            'P0DT0M0S',
            'P0DT00M00S',
            'P00DT00M00S',
            'P0DT0H0M0S',
            'P0DT00H00M00S',
            'P0M',
            'P00M',
            'P0M0D',
            'P0M0DT0H0M0S',
            'P00M00DT00H00M00S',
            'P0Y',
            'P00Y',
            'P0Y0M',
            'P00Y00M',
            'P0Y0M0D',
            'P0Y0M0DT0S',
            'P0Y0M0DT0M',
            'P0Y0M0DT0H',
            'P0Y0M0DT0H0M0S',
            'P0W',
            'P00W'
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(duration.DURATION), item, true);
            })
        })
    })
})

describe('JSON Patterns', function () {
    /*
        {
        "name": "some product",
        "price": 10.5,
        "features": [
            "easy to use",
            {
            "name": "environment friendly",
            "url": "http://example.com"
            }
        ],
        "info": {
            "onStock": true
        },
        "a/b": "a",
        "b~c": "c"
        }
    */
    describe(`[EXPECTED PASS] JSON POINTER: ${json.JSON_POINTER}`, function () {
        [
            "/name",
            "/price",
            "/features/0",
            "/features/1",
            "/features/1/name",
            "/features/1/0",
            "/a~1b", //test escaped
            "/b~0c"
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(json.JSON_POINTER), item, true);
            })
        })
    })
})

describe('URI Patterns', function () {
    describe(`[EXPECTED PASS] IP Literal: ${uri.URI.URI}`, function () {
        [
            "ftp://ftp.is.co.za/rfc/rfc1808.txt",
            "http://www.ietf.org/rfc/rfc2396.txt",
            "ldap://[2001:db8::7]/c=GB?objectClass?one",
            "mailto:John.Doe@example.com",
            "news:comp.infosystems.www.servers.unix",
            "tel:+1-816-555-1212",
            "telnet://192.0.2.16:80/",
            "urn:oasis:names:specification:docbook:dtd:xml:4.1.2",
            "https://google.com",
            "https://www.google.com",
            "https://google.com?",
            "https://google.com?id",
            "https://google.com#",
            "https://google.com#id",
        ].forEach((item, index) => {
            it(`${item} - [${index}]`, function () {
                test(regex(uri.URI.URI), item, true);
            })
        })
    })
})