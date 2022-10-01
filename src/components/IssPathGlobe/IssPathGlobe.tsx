import { useMemo } from "react";
import moment from "moment";
import Globe from "react-globe.gl";
import { buildPathsBetweenDates } from "../../helpers/SatellitePositionHelper";
import { GloboProps } from "../../interfaces/Globo";

const colorArray = [
  "#0066ff",
  "#770768",
  "#e97807",
  "#ffbf00",
  "#ff0000",
  "#04a727",
];

const IssPathGlobe = ({ satelliteId, satRec }: GloboProps) => {
  const gData = useMemo(() => {
    const data = buildPathsBetweenDates(
      satRec!,
      new Date(),
      moment().add(2, "days").toDate()
    );
    return data;
  }, [satRec]);

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      pathsData={gData}
      pathColor={() => colorArray}
      pathDashLength={0.01}
      pathDashGap={0.004}
      pathDashAnimateTime={100000}
    />
  );
};

export { IssPathGlobe };
