import {
  propagate,
  EciVec3,
  eciToGeodetic,
  gstime,
  SatRec,
} from "satellite.js";
import { EARTH_RADIUS_KM } from "../constants";
import { radiansToDegrees } from "../helpers/radiansToDegrees";
import { SatelliteCoordinates } from "../interfaces/Satellite";

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

export { buildSatellitePostion };
