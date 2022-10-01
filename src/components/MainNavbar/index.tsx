import "./index.css";

interface Props {}
export const MainNavbar: React.FC<Props> = () => {
  return (
    <div className="main-navbar">
      <ul className="main-navbar-ul">
        <li>
          <button className="main-navbar-button">ISS</button>
        </li>
        <li>
          <button className="main-navbar-button">ISS</button>
        </li>
      </ul>
    </div>
  );
};
