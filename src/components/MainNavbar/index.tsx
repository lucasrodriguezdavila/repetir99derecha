import "./index.css";

interface Props {}
export const MainNavbar: React.FC<Props> = () => {
  return (
    <div className="main-navbar">
      <ul className="main-navbar-ul">
        <li className="main-navbar-menu-item">
          <button className="main-navbar-button">ISS</button>
          <ul className="main-navbar-dropdown">
            <li>
              <a href="/">Risk</a>
              <a href="/">Risk</a>
              <a href="/">Risk</a>
              <a href="/">Risk</a>
            </li>
          </ul>
        </li>
        <li>
          <button className="main-navbar-button">ISS</button>
        </li>
      </ul>
    </div>
  );
};
