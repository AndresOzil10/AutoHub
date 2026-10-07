import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./Pages/Login";
import { UserProvider } from "./context/UserContext";
import Home from "./Pages/Home";




const App = () => {
  return (
    <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/AutoHub" index element={<Login />} />
            <Route path="/AutoHub/home" element={<Home />} />
            {/* <Route path="/all-equipment" element={<AllEquipment />} />
            <Route path="/antenas" element={<Antenas />} />
            <Route path="/responsive" element={<Responsives  />} />
            <Route path="/Production" element={<Production />} />
            <Route path="/reportes" element={<Reportes />} /> */}
          </Routes>
        </UserProvider>
      </BrowserRouter>
  );
}

export default App;