import "./index.css";

interface Props {}
export const MainNavbar: React.FC<Props> = () => {
  return (
    <div className="main-navbar">
      <ul className="main-navbar-ul">
        <li className="main-navbar-menu-item">
          <button className="main-navbar-button">
            <p className="main-navbar-title">Enter ISS</p>
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
