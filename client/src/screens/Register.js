import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sucess from '../components/sucess';
import Error from '../components/Error';    

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {           
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            setLoading(false);
            return;
        }
        
        const userData = {name, email, password};
        try{
            const response = await axios.post('/api/users/register', userData);
            console.log('Registration response:', response.data);
            
            if (response.data.user) {
                login(response.data.user); // Use AuthContext login function
                setMessage('Registration successful! Redirecting...');
                setMessageType('success');
                
                // Clear form
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                
                // Navigate after a short delay to show success message
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setMessage('Registration failed. Please try again.');
                setMessageType('error');
            }
        }catch(err){
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.message || 'User registration failed';
            setMessage(errorMessage);
            setMessageType('error');
        }
        setLoading(false);
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join us and start your journey</p>
                </div>
                
                {message && (
                    <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input 
                            type="text" 
                            id="name"
                            placeholder="Enter your full name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword"
                            placeholder="Confirm your password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register