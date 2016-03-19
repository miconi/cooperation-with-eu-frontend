/**
 * @fileOverview Tests for DataProvider.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", "intern!bdd", "app/DataProvider", "intern/chai!expect"], function (require, exports, bdd, DataProvider, expect) {
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
                var minMax = DataProvider.minMaxFromConnections(values);
                // then
                expect(minMax).to.deep.equal([1, 9]);
            });
        });
    });
});
