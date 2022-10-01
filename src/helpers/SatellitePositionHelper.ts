import {
  propagate,
  EciVec3,
  eciToGeodetic,
  gstime,
  SatRec,
} from "satellite.js";
import { EARTH_RADIUS_KM } from "../constants";
import { radiansToDegrees } from "./RadiansToDegrees";
import { SatelliteCoordinates } from "../interfaces/Satellite";
import moment from "moment";

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

const buildPathsBetweenDates = (
  satrec: SatRec,
  startDate: Date,
  endDate: Date
) => {
  if (!satrec) return [];
  const paths = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    const path = buildSatellitePostion(satrec, currentDate);
    paths.push([path.latitude, path.longitude, path.altitude]);
    currentDate = moment(currentDate).add(1, "minutes").toDate();
  }
  return [paths];
};

export { buildSatellitePostion, buildPathsBetweenDates };
