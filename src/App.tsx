import Globo from "./components/Globo/Globo";
import { MainNavbar } from "./components/MainNavbar";

function App() {
  const satelliteId = 25544;

  return (
    <div className="App">
      <MainNavbar />
      <Globo satelliteId={satelliteId} />
    </div>
  );
}

export default App;
