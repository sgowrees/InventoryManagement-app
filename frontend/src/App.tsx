import { Routes, Route} from "react-router-dom"
import Login from "./pages/login"
import Forgot from "./pages/forgot"
import Dashboard from "./pages/dashboard"

import Setting from "./pages/Settings/setting"
import Report from "./pages/report"
//import UpdateName from "./pages/Setting/UpdateName"
//import UpdatePhone from "./pages/Setting/UpdatePhone"
//import UpdateBio from "./pages/Setting/UpdateBio"
//import UpdatePhoto from "./pages/Setting/UpdatePhoto"
import './css/App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path = "/dashboard" element= {<Dashboard />} />
      <Route path = "/forgot" element= {<Forgot />} />
      <Route path = "/setting" element= {<Setting />} />
      <Route path = "/report" element= {<Report />} />

      {/*
      <Route path = "/update-name" element= {<UpdateName />} />
      <Route path = "/update-phone" element= {<UpdatePhone />} />
      <Route path = "/update-bio" element= {<UpdateBio />} />
      <Route path = "/update-photo" element= {<UpdatePhoto />} />
      */}

    </Routes>
  );
}

export default App;