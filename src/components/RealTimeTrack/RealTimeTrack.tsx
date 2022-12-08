import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { SatRec, twoline2satrec } from "satellite.js";
import { OctahedronGeometry, MeshLambertMaterial, Mesh } from "three";
import { ReactComponent as Logo } from "../../assets/NASA_logo.svg";
import {
  EARTH_RADIUS_KM,
  INITIAL_POSITION,
  SAT_SIZE,
  ALTITUDE_OFFSET,
} from "../../constants";
import { GloboProps } from "../../interfaces/Globo";
import {
  buildPathsBetweenDates,
  buildSatellitePostion,
} from "../../helpers/SatellitePositionHelper";
import { getSatelliteByID } from "../../services/SatelliteService";
import { SatelliteTLEResponse } from "../../services/types/satelliteTleResponse";

//stuff about the ISS model
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import moment from "moment";
import { useSatellite } from "../../context/SatelliteContext";
import * as THREE from "three";
import Panel from "../Live/Panel/Panel";
import { NASASpotStation } from "../NASASpotStation";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";

import "./index.css";
import { Location } from "../Location";
import { NasaLogo } from "../NasaLogo";
import { SpaceAppsLogo } from "../SpaceAppsLogo";

const colorInterpolator = (t: number) => `rgba(255,100,50,${Math.sqrt(1 - t)})`;

const RealTimeTrack = ({ satelliteId }: GloboProps) => {
  const globeEl = useRef<GlobeMethods>();
  const [globeRadius, setGlobeRadius] = useState(0);
  const [satData, setSatData] = useState<SatRec>();
  const [issModel, setIssModel] = useState<THREE.Object3D | undefined>(
    undefined
  );
  const { isISSTracked, relativeTime } = useSatellite();
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error({ err });
        }
      );
    }
  };

  useEffect(() => {
    // time ticker
    const globe = globeEl.current;
    handleLoadISSModel("/assets/ISS1.gltf");
    promptLocation();
    new THREE.TextureLoader().load(
      require("../../assets/fair_clouds_4k.png"),
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
        //@ts-ignore
        altitude: (satPosition.altitude as number) + ALTITUDE_OFFSET,
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

  const handleLocationFocus = (location: { lat: number; lng: number }) => {
    if (!globeEl.current) return;
    globeEl.current.pointOfView(
      {
        lat: location.lat,
        lng: location.lng,
        altitude: 0.7,
      },
      10
    );
  };

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
        globeImageUrl={require("../../assets/2_no_clouds_4k.jpg")}
        bumpImageUrl={require("../../assets/elev_bump_4k.jpg")}
        pathsData={gData}
        atmosphereAltitude={0.3}
        // @ts-ignore
        pathPointAlt={satPosition.altitude}
        pathColor={() => "rgba(239, 58, 31, 0.8)"}
        pathDashAnimateTime={100000}
        ringsData={currentLocation ? [currentLocation] : []}
        ringColor={() => colorInterpolator}
        ringAltitude={0.01}
        ringMaxRadius={2}
        ringPropagationSpeed={1}
        ringRepeatPeriod={1000}
      />
      {isISSTracked && (
        <Panel position="left">
          <>
            <Logo />
            <h3>International Space Station.</h3>
            <article>
              The ISS is a proof of the potential of humanity represented by the
              union of 16 countries with the sole purpose of maintaining the
              first and only permanent microgravity research station to date. It
              takes advantage of these peculiar conditions allowing rigorous
              studies that allow great advances in science and engineering. It
              was first built by two small modules, one Russian and one
              American, and later expanded over time to what we see now, being a
              ship the size of a soccer stadium with modules mainly from Russia
              and the United States and others from Japan, Canada, and the
              European Union. The ISS has two objectives, which are research and
              development in space exploration and research in microgravity
              conditions. The first is based on testing and developing
              technology on life support, propulsion, safety and systems that
              will promote advances towards out-of-Earth orbit travel. The
              second deals with studies and research in unique conditions that
              result from being about 400km from the Earth's surface, both in
              gravity, pressure, temperature, humidity, and other important
              factors.
            </article>
            <h3>CURIOSITIES</h3>
            Due to the speed and trajectory of the ISS, the crew members observe
            sunset and sunrise about 16 times per day. This is a biological test
            for them to pass as they adapt to life on the station. Crew
            rotations change after 6 months, and life there means a series of
            physical and mental care along with rigorous and dedicated research
            work, requiring a lot of knowledge in fields such as astrophysics,
            astronomy, physics, engineering, among others, combined with a great
            deal of preparation and psychological fortitude.
          </>
        </Panel>
      )}
      {isISSTracked && (
        <Panel position="right">
          <div className="video-container">
            <h1>ISS Live Stream</h1>
            <YoutubeEmbed url="https://www.youtube.com/embed/86YLFOog4GM" />
            <YoutubeEmbed url="https://www.youtube.com/embed/ddZu_1Z3BAc" />
          </div>
        </Panel>
      )}
      <NASASpotStation visible={!isISSTracked} />
      {!isISSTracked && (
        <>
          <Location
            location={currentLocation}
            onLocationPrompt={promptLocation}
            onLocationFocus={handleLocationFocus}
          />
          <NasaLogo />
          <SpaceAppsLogo />
        </>
      )}
    </>
  );
};

export default RealTimeTrack;
