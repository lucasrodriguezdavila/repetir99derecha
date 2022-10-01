import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { OctahedronGeometry, MeshLambertMaterial, Mesh } from "three";
import { EARTH_RADIUS_KM, INITIAL_POSITION } from "../../constants";
import { GloboProps } from "../../interfaces/Globo";
import { SatellitePosition } from "../../interfaces/Satellite";
import {
  buildSatellitePostion,
  getCoordinates,
} from "../../services/SatellitePositionService";
import { getSatelliteByID } from "../../services/SatelliteService";
import { SatelliteTLEResponse } from "../../services/types/satelliteTleResponse";

const SAT_SIZE = 80; // km
const TIME_STEP = 3 * 1000; // per frame

const Globo = ({ satelliteId }: GloboProps) => {
  const globeEl = useRef<GlobeMethods>();
  const [time, setTime] = useState(new Date());
  const [globeRadius, setGlobeRadius] = useState(0);
  const [satData, setSatData] = useState<SatelliteTLEResponse>();

  useEffect(() => {
    if (!globeEl.current) return;

    globeEl.current.pointOfView({ altitude: 4 }, 10);
  }, []);

  useEffect(() => {
    // time ticker
    (function frameTicker() {
      requestAnimationFrame(frameTicker);
      setTime((time) => new Date(+time + TIME_STEP));
    })();
  }, []);

  useEffect(() => {
    // get satellite data
    getSatelliteByID(satelliteId).then((sat) => {
      const data = sat as unknown as SatelliteTLEResponse;
      debugger;
      if (data.line1) {
        setSatData(data);
      }
    });
  }, []);

  const satPosition = useMemo(() => {
    debugger;
    if (!satData) return INITIAL_POSITION;
    const coordinates = getCoordinates(satData);
    return buildSatellitePostion(coordinates);
  }, [satData, time]);

  const satObject = useMemo(() => {
    if (!globeRadius) return undefined;

    const satGeometry = new OctahedronGeometry(
      (SAT_SIZE * globeRadius) / EARTH_RADIUS_KM / 2,
      0
    );
    const satMaterial = new MeshLambertMaterial({
      color: "red",
      transparent: false,
      opacity: 1,
    });
    return new Mesh(satGeometry, satMaterial);
  }, [globeRadius]);

  useEffect(() => {
    setGlobeRadius(globeEl?.current?.getGlobeRadius() ?? 1);
    globeEl?.current?.pointOfView({ altitude: 3.5 });
  }, []);

  return (
    <Globe
      ref={globeEl}
      objectsData={[satPosition]}
      objectThreeObject={satObject}
      objectLabel="pito"
      objectLat="lat"
      objectLng="lng"
      objectAltitude="alt"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
    />
  );
};

export default Globo;
