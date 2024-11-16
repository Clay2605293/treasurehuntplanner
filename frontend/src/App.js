import React, { useState } from "react";
import Form from "./components/Form";
import DownloadLinks from "./components/DownloadLinks";

const App = () => {
  const [equipos, setEquipos] = useState([]);

  return (
    <div>
      <h1>Treasure Hunt Generator</h1>
      <Form setEquipos={setEquipos} />
      {equipos.length > 0 && <DownloadLinks equipos={equipos} />}
    </div>
  );
};

export default App;
