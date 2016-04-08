/**
 * @fileOverview Tests for DataProvider.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", "intern!bdd", "intern/chai!expect", "../../app/data/DataProvider"], function (require, exports, bdd, expect, DataProvider_1) {
    //------------------------ TESTS --------------------------
    bdd.describe("DataProvider", function () {
        bdd.describe("#minMaxFromConnections", function () {
            bdd.it("should find min & max values", function () {
                // given
                var values = [9, 2, 5, 2, 1]
                    .map(function (n) {
                    return { value: n };
                });
                // when
                var minMax = DataProvider_1["default"].minMaxFromConnections(values);
                // then
                expect(minMax).to.deep.equal([1, 9]);
            });
        });
    });
});
