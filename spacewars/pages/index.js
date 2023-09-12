import React, { useState } from 'react';
import Layout from '../components/layout';
import SignUp from '../components/signUp';
import LogIn from '../components/logIn';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(null);

  const toggleForm = (formType) => {
    if (showForm === formType) {
      setShowForm(null); // Hide form if already showing
    } else {
      setShowForm(formType); // Show the form
    }
  };

  return (
    <div className="container mx-auto px-4">
      {!isLoggedIn && <h2 className="text-2xl font-bold mb-4">Welcome sign in below!</h2>}

      <button onClick={() => toggleForm('signup')} className="bg-blue-500 text-white p-2 rounded-md m-2">
        Create an Account
      </button>
      <button onClick={() => toggleForm('login')} className="bg-blue-500 text-white p-2 rounded-md m-2">
        Have an Account Already? Sign In
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {showForm === 'signup' && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <SignUp setShowForm={setShowForm} />
          </div>
        )}

        {showForm === 'login' && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-2">Log In</h3>
            <LogIn setShowForm={setShowForm} setIsLoggedIn={setIsLoggedIn} />
          </div>
        )}
      </div>
    </div>
  );
}
