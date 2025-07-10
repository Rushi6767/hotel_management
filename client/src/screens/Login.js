import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try{
            const response = await axios.post('/api/users/login', {email, password});
            console.log('Login response:', response.data);
            
            if (response.data.user) {
                login(response.data.user); // Use AuthContext login function
                setMessage('Login successful! Redirecting...');
                setMessageType('success');
                
                // Clear form
                setEmail('');
                setPassword('');
                
                // Navigate after a short delay to show success message
                setTimeout(() => {
                    navigate('/');
                }, 500);
            } else {
                setMessage('Login failed. Please try again.');
                setMessageType('error');
            }
        }catch(err){
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setMessage(errorMessage);
            setMessageType('error');
        }
        setLoading(false);
    }
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>
                
                {message && (
                    <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
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
                            autoComplete="off" 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login