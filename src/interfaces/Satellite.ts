import * as satellite from "satellite.js";

export interface Satellite {
  satrec: satellite.SatRec;
  name: string;
}

export interface SatellitePosition {
  position: {
    x: number;
    y: number;
    z: number;
  };
  velocity: {
    y: number;
    z: number;
  };
}

export interface SatelliteCoordinates {
  latitude: number;
  longitude: number;
  altitude: number;
}
