/**
 * @fileOverview Utilities for constructing d3 scales.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */
var ScaleFactory;
(function (ScaleFactory) {
    /**
     * Create a linear d3 scale with the domain constructed from the values
     * passed.
     *
     * @param values Used to find min and max needed to construct a domain
     * for a scale.
     */
    function newLinearFromValues(values) {
        return d3.scale.linear()
            .domain([d3.min(values), d3.max(values)]);
    }
    ScaleFactory.newLinearFromValues = newLinearFromValues;
})(ScaleFactory || (ScaleFactory = {}));