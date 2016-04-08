/**
 * @fileOverview MinMaxService class.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */


import d3 = require('d3');

import {Connection, MinMax} from "../data";


export default class MinMaxService {

    static minMaxFromConnections(connections: Connection[]): MinMax {
        var values: number[] = connections.map(c => Number(c.value));
        return [d3.min(values), d3.max(values)];
    }

}
