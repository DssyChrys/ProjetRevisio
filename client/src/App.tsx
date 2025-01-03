import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home/home";
import Login from "./components/login/login";
import Register from "./components/register/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>   
    </Router>
  );
}

export default App;
