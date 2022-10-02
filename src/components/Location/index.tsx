import React from "react";
import { BiCurrentLocation } from "react-icons/bi";
import "./index.css";

interface Props {
  onLocationPrompt?: () => void;
  onLocationFocus?: (loc: { lat: number; lng: number }) => void;
  location?: {
    lat: number;
    lng: number;
  };
}

export const Location: React.FC<Props> = ({
  onLocationPrompt,
  location,
  onLocationFocus,
}) => {
  const handleOnClick = () => {
    if (onLocationPrompt && !location) {
      onLocationPrompt();
      return;
    }
    if (location) {
      onLocationFocus && onLocationFocus(location);
    }
  };

  return (
    <div className="location-container" onClick={handleOnClick}>
      <div className="location-icon">
        <BiCurrentLocation
          size={52}
          color={location ? "#2864FF" : "gray"}
        ></BiCurrentLocation>
      </div>
      <div className="location-description-container">
        <p className="location-text">
          {location ? "Track me!" : "Use my current location"}
        </p>
      </div>
    </div>
  );
};
