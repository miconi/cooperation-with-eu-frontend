/**
 * @fileOverview Utilities for constructing d3 scales.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */

namespace ScaleFactory {

    import Numeric = d3.Numeric;
    /**
     * Create a linear d3 scale with the domain constructed from the values
     * passed.
     *
     * @param values Used to find min and max needed to construct a domain
     * for a scale.
     */
    export function newLinearFromValues(values: number[]): d3.scale.Linear<number, any> {
        return d3.scale.linear()
        .domain([d3.min(values), d3.max(values)]);
    }
}
