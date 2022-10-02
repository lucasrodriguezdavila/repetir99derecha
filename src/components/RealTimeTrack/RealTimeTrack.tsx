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
import {
  buildPathsBetweenDates,
  buildSatellitePostion,
} from "../../helpers/SatellitePositionHelper";
import {
  getCorsFreeUrl,
  getSatelliteByID,
} from "../../services/SatelliteService";
import { SatelliteTLEResponse } from "../../services/types/satelliteTleResponse";

//stuff about the ISS model
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import moment from "moment";
import { useSatellite } from "../../context/SatelliteContext";
import * as THREE from "three";
import Panel from "../Live/Panel/Panel";

const colorInterpolator = (t: number) => `rgba(255,100,50,${Math.sqrt(1 - t)})`;

const RealTimeTrack = ({ satelliteId }: GloboProps) => {
  const globeEl = useRef<GlobeMethods>();
  const [globeRadius, setGlobeRadius] = useState(0);
  const [satData, setSatData] = useState<SatRec>();
  const [issModel, setIssModel] = useState<THREE.Object3D | undefined>(
    undefined
  );
  const { isISSTracked, setRelativeTime, relativeTime } = useSatellite();
  const [currentLocation, setCurrentLocation] = useState<
    | {
        lat: number;
        lng: number;
      }
    | undefined
  >();

  const handleLoadISSModel = async (gltfPath: string) => {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderConfig({ type: "js" });
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

    loader.setDRACOLoader(draco);
    const gltf = await loader.loadAsync(gltfPath);

    gltf.scene.scale.set(15, 15, 15);
    // rotate the model 90 degrees around the x-axis
    gltf.scene.rotateX(Math.PI / 2);
    setIssModel(gltf.scene);
  };

  useEffect(() => {
    if (!globeEl.current) return;

    globeEl.current.pointOfView({ altitude: 4 }, 10);
  }, []);

  const promptLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      });
    }
  };

  useEffect(() => {
    // time ticker
    const globe = globeEl.current;
    handleLoadISSModel("/assets/ISS1.gltf");
    promptLocation();
    new THREE.TextureLoader().load(
      getCorsFreeUrl(
        "https://github.com/turban/webgl-earth/blob/master/images/fair_clouds_4k.png?raw=true"
      ),
      (cloudsTexture) => {
        const CLOUDS_ALT = 0.004;
        const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(
            // @ts-ignore
            globe.getGlobeRadius() * (1 + CLOUDS_ALT),
            75,
            75
          ),
          new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
        );
        // @ts-ignore
        globe.scene().add(clouds);

        (function rotateClouds() {
          clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
          requestAnimationFrame(rotateClouds);
        })();
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return { ...buildSatellitePostion(satData, relativeTime), name: "ISS" };
  }, [satData, relativeTime]);

  useEffect(() => {
    if (isISSTracked) {
      // @ts-ignore
      globeEl.current.pointOfView({
        // @ts-ignore
        lat: satPosition.latitude as number,
        //@ts-ignore
        lng: satPosition.longitude as number,
      });
      // @ts-ignore
      globeEl.current.controls().enableRotate = false;
      // @ts-ignore
      globeEl.current.controls().update();
    } else {
      // @ts-ignore
      globeEl.current.controls().enableRotate = true;
      // @ts-ignore
      globeEl.current.controls().update();
    }
  }, [relativeTime, satPosition, isISSTracked]);

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
    if (issModel) {
      return issModel;
    }
    return new Mesh(satGeometry, satMaterial);
  }, [globeRadius, issModel]);

  useEffect(() => {
    setGlobeRadius(globeEl!.current!.getGlobeRadius());
    globeEl!.current!.pointOfView({ altitude: 3.5 });
  }, []);

  const gData = useMemo(() => {
    const data = buildPathsBetweenDates(
      satData!,
      relativeTime,
      moment(relativeTime).add(4, "hours").toDate()
    );
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [satData]);

  return (
    <>
      <Globe
        ref={globeEl}
        objectsData={[satPosition]}
        objectThreeObject={satObject}
        objectLabel="name"
        objectLat="latitude"
        objectLng="longitude"
        objectAltitude="altitude"
        globeImageUrl={getCorsFreeUrl(
          "https://github.com/turban/webgl-earth/blob/master/images/2_no_clouds_4k.jpg?raw=true"
        )}
        bumpImageUrl={getCorsFreeUrl(
          "https://github.com/turban/webgl-earth/blob/master/images/elev_bump_4k.jpg?raw=true"
        )}
        pathsData={gData}
        atmosphereAltitude={0.3}
        // @ts-ignore
        pathPointAlt={satPosition.altitude}
        pathDashAnimateTime={100000}
        ringsData={currentLocation ? [currentLocation] : []}
        ringColor={() => colorInterpolator}
        ringAltitude={0.01}
        ringMaxRadius={2}
        ringPropagationSpeed={1}
        ringRepeatPeriod={1000}
      />
      {isISSTracked && <Panel></Panel>}
    </>
  );
};

export default RealTimeTrack;
