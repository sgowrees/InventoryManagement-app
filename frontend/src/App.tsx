import { Routes, Route} from "react-router-dom"
import Login from "./pages/login"
import Forgot from "./pages/forgot"
import Dashboard from "./pages/dashboard"
import './css/App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path = "/dashboard" element= {<Dashboard />} />
      <Route path = "/forgot" element= {<Forgot />} />
    </Routes>
  );
}

export default App;