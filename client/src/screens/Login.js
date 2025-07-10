import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, password);
        try{
            const res = (await axios.post('/api/users/login', {email, password})).data;
            console.log(res);
        }catch(err){
            console.log(err);
        }
    }
  return (
    <div>
        <h1>Login</h1>
        <form>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit" onClick={handleSubmit}>Login</button>
        </form>
    </div>
  )
}

export default Login