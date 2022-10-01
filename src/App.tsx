import Globo from "./components/Globo/Globo";

function App() {
  const satelliteId = 25544;
  return (
    <div className="App">
      <Globo satelliteId={satelliteId} />
    </div>
  );
}

export default App;
