import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';


export default function LogIn({ setShowForm, setIsLoggedIn }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const formRef = useRef(null); // Create a ref to attach to your form element

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
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

    // Simulate form submission
    console.log('User logged in:', formData);

    // Reset the form fields
    formRef.current.reset();
    setShowForm(null);
    setIsLoggedIn(true);
    router.push('/gamePage');
  };

  return (
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
    </form>
  );
}
