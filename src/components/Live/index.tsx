import moment from "moment";
import React, { useMemo } from "react";
import { useSatellite } from "../../context/SatelliteContext";
import "./index.css";

export const Live = () => {
  const { relativeTime, setRelativeTime } = useSatellite();

  // if difference is less than a second, isLive is true
  const isLive = useMemo(() => {
    const diff = moment().diff(moment(relativeTime), "seconds");
    return diff < 1 && diff > -1;
  }, [relativeTime]);

  const handleOnClick: React.MouseEventHandler<HTMLDivElement> | undefined = (
    e
  ) => {
    if (!isLive) {
      setRelativeTime(new Date());
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className={`live-container ${isLive ? "" : "live-not-live"}`}
    >
      Live<div className="live-white-dot"></div>
    </div>
  );
};
