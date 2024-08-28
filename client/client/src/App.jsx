import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home/Home";
import Register from "./views/Register/Register";
import NavbarComponent from "./components/NavbarComponent/NavbarComponent";
import Footer from "./components/Footer/Footer";
import Profile from "./views/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
