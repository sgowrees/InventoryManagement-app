import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backend_URL = import.meta.env.VITE_BACKEND_URL;
console.log(import.meta.env.VITE_BACKEND_URL);


function Login(){
    const [email, setEmail ] =useState("")
    const [password, setPassword ] = useState("")
    const navigate = useNavigate();


    const loginUser = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const UserData  = { email , password};
            const res = await axios.post(
                `${backend_URL}/api/users/login`,
                UserData,
                {
                    withCredentials: true
                }
            );
            console.log(res.data)
            navigate("/dashboard");

        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div>
            <form onSubmit={loginUser}>           
                <h1> Login </h1> 
                <input 
                    type= 'email' 
                    placeholder="Enter Email" 
                    value = {email} 
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
                <input 
                    type = 'password'
                    placeholder="Enter password" 
                    value = {password} 
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <button type="submit">login</button>
           </form>
           <Link to="/forgot"> Forgot Password</Link>
        </div>
    )
}


export default Login;