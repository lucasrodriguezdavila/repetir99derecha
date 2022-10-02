import { useCallback } from "react";
import { useSatellite } from "../../context/SatelliteContext";
import "./index.css";

interface Props {}
export const MainNavbar: React.FC<Props> = () => {
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
              {isISSTracked ? "Exit ISS" : "Enter ISS"}
            </p>
            <p className="main-navbar-subtitle">Tracking Data Panel</p>
          </button>
          <ul className="main-navbar-dropdown">
            <li>
              <a href="/">Risk</a>
              <div className="main-navbar-dropdown-divider" />
              <a href="/">Risk</a>
              <div className="main-navbar-dropdown-divider" />
              <a href="/">Risk</a>
              <div className="main-navbar-dropdown-divider" />
              <a href="/">Risk</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
