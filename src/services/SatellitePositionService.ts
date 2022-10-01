import {
  PositionAndVelocity,
  propagate,
  EciVec3,
  eciToGeodetic,
  gstime,
  SatRec,
} from "satellite.js";
import { EARTH_RADIUS_KM } from "../constants";
import { SatelliteCoordinates } from "../interfaces/Satellite";

const radiansToDegrees = (radians: number): number => {
  var pi = Math.PI;
  return radians * (180 / pi);
};

const buildSatellitePostion = (
  satrec: SatRec,
  time: Date
): SatelliteCoordinates => {
  const prop = propagate(satrec, time);
  const gtime = gstime(time);
  const coords = eciToGeodetic(prop.position as EciVec3<number>, gtime);
  const { longitude, latitude } = coords;
  return {
    longitude: radiansToDegrees(longitude),
    latitude: radiansToDegrees(latitude),
    altitude: coords.height / EARTH_RADIUS_KM,
  };
};

const getCoordinates = (satrec: SatRec, time: Date) => {
  const prediction = propagate(satrec, time);
  return getPredictionData(prediction);
};

const getPredictionData = (prediction: PositionAndVelocity) => {
  const { position, velocity } = prediction;
  const { x, y, z } = position as EciVec3<number>;
  const { x: vx, y: vy, z: vz } = velocity as EciVec3<number>;
  return {
    position: { x, y, z },
    velocity: { x: vx, y: vy, z: vz },
  };
};

export { getCoordinates, buildSatellitePostion };
