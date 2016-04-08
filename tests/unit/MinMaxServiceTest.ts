/**
 * @fileOverview Tests for MinMaxService.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


///<reference path="../../node_modules/intern/typings/intern/intern.d.ts" />

import bdd = require("intern!bdd");
import should = require("intern/chai!should");
import expect = require("intern/chai!expect");

import {Connection} from "../../app/data";
import MinMaxService from "../../app/data/MinMaxService";

//------------------------ TESTS --------------------------

bdd.describe("MinMaxService", () => {

    bdd.describe("#minMaxFromConnections", () => {

        bdd.it("should find min & max values", () => {

            // given
            var values: Connection[] =
                [9, 2, 5, 2, 1]
                .map(n => {
                    return <Connection> <any> {value: n};
                });

            // when
            const minMax = MinMaxService.minMaxFromConnections(values);

            // then
            expect(minMax).to.deep.equal([1, 9]);
        });

    });

});
