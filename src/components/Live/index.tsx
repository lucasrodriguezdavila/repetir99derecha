import moment from "moment";
import React, { useMemo } from "react";
import { useSatellite } from "../../context/SatelliteContext";
import "./index.css";

export const Live = () => {
  const { relativeTime } = useSatellite();

  // if difference is less than a second, isLive is true
  const isLive = useMemo(() => {
    const diff = moment().diff(moment(relativeTime), "seconds");
    return diff < 1 && diff > -1;
  }, [relativeTime]);

  return (
    <div className={`live-container ${isLive ? "" : "live-not-live"}`}>
      Live<div className="live-white-dot"></div>
    </div>
  );
};
