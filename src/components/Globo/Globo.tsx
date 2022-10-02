import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { SatRec, twoline2satrec } from "satellite.js";
import { OctahedronGeometry, MeshLambertMaterial, Mesh } from "three";
import {
  EARTH_RADIUS_KM,
  INITIAL_POSITION,
  SAT_SIZE,
  TIME_STEP,
} from "../../constants";
import { GloboProps } from "../../interfaces/Globo";
import { buildSatellitePostion } from "../../services/SatellitePositionService";
import { getSatelliteByID } from "../../services/SatelliteService";
import { SatelliteTLEResponse } from "../../services/types/satelliteTleResponse";

const Globo = ({ satelliteId }: GloboProps) => {
  const globeEl = useRef<GlobeMethods>();
  const [time, setTime] = useState(new Date());
  const [globeRadius, setGlobeRadius] = useState(0);
  const [satData, setSatData] = useState<SatRec>();

  useEffect(() => {
    if (!globeEl.current) return;

    globeEl.current.pointOfView({ altitude: 4 }, 10);
  }, []);

  useEffect(() => {
    // time ticker
    const interval = setInterval(() => {
      setTime(new Date());
    }, TIME_STEP);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // get satellite data
    getSatelliteByID(satelliteId).then((sat) => {
      const data = sat as unknown as SatelliteTLEResponse;
      if (data.line1) {
        const satRec = twoline2satrec(data.line1, data.line2);
        setSatData(satRec);
      }
    });
  }, [satelliteId]);

  const satPosition = useMemo(() => {
    if (!satData) return INITIAL_POSITION;
    return { ...buildSatellitePostion(satData, time), name: "ISS" };
  }, [satData, time]);

  const satObject = useMemo(() => {
    if (!globeRadius) return undefined;

    const satGeometry = new OctahedronGeometry(
      (SAT_SIZE * globeRadius) / EARTH_RADIUS_KM / 2,
      0
    );
    const satMaterial = new MeshLambertMaterial({
      color: "violet",
      transparent: false,
      opacity: 0.7,
    });
    return new Mesh(satGeometry, satMaterial);
  }, [globeRadius]);

  useEffect(() => {
    setGlobeRadius(globeEl!.current!.getGlobeRadius());
    globeEl!.current!.pointOfView({ altitude: 3.5 });
  }, []);

  return (
    <Globe
      ref={globeEl}
      objectsData={[satPosition]}
      objectThreeObject={satObject}
      objectLabel="name"
      objectLat="latitude"
      objectLng="longitude"
      objectAltitude="altitude"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
    />
  );
};

export default Globo;
