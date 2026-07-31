import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { routes } from "./route";
import { ToastContainer } from "react-toastify";
import AuthRoute from "./AuthRoute";

function App() {
  return (
    <>
    <ToastContainer/>
      <Routes>
        {routes.map((item, index) =>(
            <Route key={index} path={item.path} element={<AuthRoute  adminonly={item.adminonly}><item.comp /></AuthRoute>} />
        ))}
      </Routes>
    </>
  );
}

export default App;
