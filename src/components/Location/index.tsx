import React from "react";
import { BiCurrentLocation } from "react-icons/bi";
import "./index.css";

interface Props {
  onClick?: () => void;
}

export const Location: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="location-container" onClick={onClick}>
      <BiCurrentLocation></BiCurrentLocation>
    </div>
  );
};
