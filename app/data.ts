/**
 * @fileOverview Type definitions for the data package.
 *
 * @author Michał Oniszczuk <m.oniszczuk@icm.edu.pl>
 */

export interface Connection {
    countryFrom: string;
    countryTo: string;
    value: string;
}

export interface CountryPosition {
    country: string;
    latitude: string;
    longitude: string;
}

export interface JoinedConnection {
    origin: CountryPosition;
    destination: CountryPosition;
    value: number;
}

export interface ComputedConnection {
    origin: CountryPosition;
    destination: CountryPosition;
    strokeOpacity: number;
    strokeWidth: number;
    value: number;
}

/**
 * First element is min, second is max.
 */
export type MinMax = number[]

export interface ComputedModel {
    connections: ComputedConnection[];
    minMax: MinMax
}
