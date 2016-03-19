/**
 * @fileOverview Tests for DataProvider.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'intern!object', "app/DataProvider", "intern/chai!expect"], function (require, exports, registerSuite, DataProvider, expect) {
    //------------------------ TESTS --------------------------
    registerSuite({
        name: "DataProvider",
        "#minMaxFromConnections": {
            "should find min & max values": function () {
                // given
                var values = [9, 2, 5, 2, 1]
                    .map(function (n) {
                    return { value: n };
                });
                // when
                var minMax = DataProvider.minMaxFromConnections(values);
                // then
                expect(minMax).to.deep.equal([1, 9]);
            }
        }
    });
});
