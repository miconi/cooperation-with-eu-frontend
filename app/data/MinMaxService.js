/**
 * @fileOverview MinMaxService class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
define(["require", "exports", 'd3'], function (require, exports, d3) {
    var MinMaxService = (function () {
        function MinMaxService() {
        }
        MinMaxService.minMaxFromConnections = function (connections) {
            var values = connections.map(function (c) { return Number(c.value); });
            return [d3.min(values), d3.max(values)];
        };
        return MinMaxService;
    })();
    exports.__esModule = true;
    exports["default"] = MinMaxService;
});
