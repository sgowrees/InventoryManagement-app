import { useState, type SyntheticEvent } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;



const updateBio: React.FC = () => {
    const [updateBio, setUpdateBio] = useState("");
    const navigate= useNavigate();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            const res = await axios.patch(
                 `${BACKEND_URL}/api/users/updateuser`,
                 updateBio,
                 {withCredentials: true}
            )
            navigate('/setting')

        } catch (error) {
            console.log(error)
        }
    }

}