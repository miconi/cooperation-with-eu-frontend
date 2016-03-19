/**
 * @fileOverview Tests for DataProvider.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


///<reference path="../../node_modules/intern/typings/intern/intern.d.ts" />

import bdd = require("intern!bdd");
import DataProvider = require("app/DataProvider");
import should = require("intern/chai!should");
import expect = require("intern/chai!expect");


//------------------------ TESTS --------------------------

bdd.describe("DataProvider", () => {

    bdd.describe("#minMaxFromConnections", () => {

        bdd.it("should find min & max values", () => {

            // given
            var values = [9, 2, 5, 2, 1]
                .map(n => {
                    return {value: n};
                });

            // when
            const minMax = DataProvider.minMaxFromConnections(values);

            // then
            expect(minMax).to.deep.equal([1, 9]);
        });

    });

});
