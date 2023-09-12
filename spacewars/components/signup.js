import React, { useState, useRef } from 'react';

export default function SignUp({ setShowForm }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
    const email = formData.email;
    const password = formData.password;

    if (!username || username.length < 3) {
      alert("Username must be at least 3 characters long");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // Simulate form submission
    console.log("Form is valid! Submitting...");


    // Reset form fields
    formRef.current.reset();
    setShowForm(null);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-blue-500"
          placeholder="Enter your username"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-blue-500"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-blue-500"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Sign Up</button>
    </form>
  );
}
