import { useCallback } from "react";
import { useSatellite } from "../../context/SatelliteContext";
import "./index.css";

interface Props {
  isHidden?: boolean;
}
export const MainNavbar: React.FC<Props> = ({ isHidden }) => {
  const { setIsISSTracked, isISSTracked } = useSatellite();

  const handleTrackISS = useCallback(() => {
    setIsISSTracked((prev) => !prev);
  }, [setIsISSTracked]);
  return (
    <div className="main-navbar">
      <ul className="main-navbar-ul">
        <li className="main-navbar-menu-item">
          <button onClick={handleTrackISS} className="main-navbar-button">
            <p className="main-navbar-title">
              {isISSTracked ? "Stop follow ISS" : "Follow ISS"}
            </p>
            <p className="main-navbar-subtitle">Tracking Data Panel</p>
          </button>
        </li>
      </ul>
    </div>
  );
};
