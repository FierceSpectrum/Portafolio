import "./App.css";
import { createHashRouter, RouterProvider } from "react-router-dom";

import Navegation from "./Components/Navegation/Navegation";

const router = createHashRouter([
  {
    path: "/",
    element: <Navegation />,
    children: [
      {
        path: "Portafolio",
        element: <></>,
      },
      {
        path: "Curriculum",
        element: <></>,
      },
      {
        path: "Projects",
        element: <></>,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
