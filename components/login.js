import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LogIn({ setShowForm, setIsLoggedIn, sucessLoginMsg }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const username = formData.username;
    const password = formData.password;

    if (!username || username.length < 3) {
      alert("Username must be at least 3 characters long");
      return;
    }

    if (!password || password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    const userCredentials = {
      username,
      password,
    };
    console.log(userCredentials)
    try {
      const response = await axios.post('http://localhost:5000/api/login', userCredentials);
      if (response.status === 200) {

        console.log('User logged in:', response.data);
        let validUsername = response.data.user.username;
        let userId = response.data.user.id;

        // Reset form fields
        formRef.current.reset();
        setShowForm(null);
        setIsLoggedIn(true);

        // Send user to the game page
        sucessLoginMsg();
        setTimeout(() => {
          router.push({
            pathname: '/gamePage',
            query: { userId ,validUsername },
          });
        }, 2000);
      }
    } catch (error) {
      // Log the error
      console.error('Error logging in:', error.response.data.error);
      setErrorMessage(error.response.data.error);
    }
  };

  return (
    <div>

    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleChange}
          required
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-blue-500"
          placeholder="Username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
          required
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-blue-500"
          placeholder="Password"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200">
        Log In
      </button>
      {errorMessage && (<div className="text-red-500">{errorMessage}</div>)}
    </form>
    </div>
  );
}
