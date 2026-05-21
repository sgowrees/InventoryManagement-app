import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from '../../components/Sidebar';
//import "../css/setting.css"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Setting(){
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [Profile, SetProfile] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get(
                    `${BACKEND_URL}/api/users/getUser`,
                    { withCredentials: true }
                );
                SetProfile(userRes.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            
        </div>
    );
}

export default Setting;