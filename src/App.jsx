import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { routes } from "./route";

function App() {
  return (
    <>
      <Routes>
        {routes.map((item, index) =>(
            <Route key={index} path={item.path} element={<item.comp />} />
        ))}
      </Routes>
    </>
  );
}

export default App;
