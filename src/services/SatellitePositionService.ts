import {
  PositionAndVelocity,
  propagate,
  twoline2satrec,
  EciVec3,
  eciToGeodetic,
  gstime,
  degreesLong,
  degreesLat,
} from "satellite.js";
import { EARTH_RADIUS_KM } from "../constants";
import {
  SatelliteCoordinates,
  SatellitePosition,
} from "../interfaces/Satellite";
import { SatelliteTLEResponse } from "./types/satelliteTleResponse";

const getPredictionData = (prediction: PositionAndVelocity) => {
  const { position, velocity } = prediction;
  const { x, y, z } = position as EciVec3<number>;
  const { x: vx, y: vy, z: vz } = velocity as EciVec3<number>;
  return {
    position: { x, y, z },
    velocity: { x: vx, y: vy, z: vz },
  };
};

const getCoordinates = (satelliteData: SatelliteTLEResponse) => {
  const { line1, line2 } = satelliteData;
  const twoLines = twoline2satrec(line1, line2);
  const prediction = propagate(twoLines, new Date());
  return getPredictionData(prediction);
};

const buildSatellitePostion = (
  data: SatellitePosition
): SatelliteCoordinates => {
  const time = gstime(new Date());
  const coords = eciToGeodetic(data.position, time);
  const { longitude, latitude } = coords;
  return {
    longitude: degreesLong(longitude),
    latitude: degreesLat(latitude),
    altitude: coords.height / EARTH_RADIUS_KM,
  };
};

export { getCoordinates, buildSatellitePostion };
