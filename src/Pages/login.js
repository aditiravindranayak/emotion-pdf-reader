import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Pages/login.css';
import laptopImage from '../assets/laptop-image.png';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    try {
      const response = await axios.post(url, formData);
      console.log(response.data);
      navigate('/home'); // Redirect to the homepage after successful login/register
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="login-page">
      <img src={laptopImage} alt="Person working on a laptop" className="laptop-image" />
      <div className="form">
        {isLogin ? (
          <>
            <h2 className="form-heading">Login to your Account</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="email"
                placeholder="email address"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="submit" className="login-btn">Login</button>
              <p className="message">Not registered? <a href="#" onClick={toggleForm}>Create an account</a></p>
            </form>
          </>
        ) : (
          <>
            <h2 className="form-heading">Create a New Account</h2>
            <form className="register-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="email"
                placeholder="email address"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="submit" className="register-btn">Create</button>
              <p className="message">Already registered? <a href="#" onClick={toggleForm}>Sign In</a></p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
