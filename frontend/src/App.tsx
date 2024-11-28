import "./App.css";
import Signup from "./components/signup";
import Signin from "./components/signin";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="">
      <BrowserRouter>
      <Routes>
        <Route element={<Signup />} path="/signup"/>
        <Route element={<Signin />} path="/signin"/>
      </Routes>
      
      </BrowserRouter>{" "}
    </div>
  );
}

export default App;
