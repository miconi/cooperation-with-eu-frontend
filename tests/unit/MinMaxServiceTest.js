/**
 * @fileOverview Tests for MinMaxService.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", "intern!bdd", "intern/chai!expect", "../../app/data/MinMaxService"], function (require, exports, bdd, expect, MinMaxService_1) {
    //------------------------ TESTS --------------------------
    bdd.describe("MinMaxService", function () {
        bdd.describe("#minMaxFromConnections", function () {
            bdd.it("should find min & max values", function () {
                // given
                var values = [9, 2, 5, 2, 1]
                    .map(function (n) {
                    return { value: n };
                });
                // when
                var minMax = MinMaxService_1["default"].minMaxFromConnections(values);
                // then
                expect(minMax).to.deep.equal([1, 9]);
            });
        });
    });
});
