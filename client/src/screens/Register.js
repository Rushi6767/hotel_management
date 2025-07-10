import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react'; 
import axios from 'axios';
function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {           
        e.preventDefault();
        console.log(name, email, password, confirmPassword);
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const userData = {name, email, password};
        try{
            const res = (await axios.post('/api/users/register', userData)).data;
            console.log(res);
        }catch(err){
            console.log(err);
        }
    }
  return (
    <div>
        <h1>Register</h1>
        <form>
            <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)}/>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <button type="submit" onClick={handleSubmit}>Register</button>
        </form>
        <Link to="/login">Already have an account? Login</Link>
    </div>
  )
}

export default Register