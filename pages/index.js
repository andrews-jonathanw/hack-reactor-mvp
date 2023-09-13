require('dotenv').config();
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout';
import SignUp from '../components/signUp';
import LogIn from '../components/logIn';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../components/UserContext';
import { useRouter } from 'next/router';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function App() {
  const [showForm, setShowForm] = useState(null);
  const [user, setUser] = useState({user: {id: 0, username: 'null'}});
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { userInfo } = useUser();
  const isLoggedIn = userInfo !== null;
  const prevIsLoggedInRef = useRef();

  useEffect(() => {
    const prevIsLoggedIn = prevIsLoggedInRef.current;
    if (prevIsLoggedIn && !isLoggedIn) {
      successLogoutMsg();
    }
    prevIsLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  useEffect(() => {
    if (userInfo !== null) {
      setUser(userInfo);
      setIsLoggingIn(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (isLoggingIn) {
      console.log("User is currently trying to log in...");
    } else {
      console.log("User is not currently trying to log in.");
    }
  }, [isLoggingIn]);

  useEffect(() => {
    if (router.query.needLogin) {
      toast.error("Login first to visit the account page!");
    }
  }, [router.query]);


  const toggleForm = (formType) => {
    if (showForm === formType) {
      setShowForm(null);
    } else {
      setShowForm(formType);
    }
  };

  const successLoginMsg = () => {
    toast.success("Login Successful!");
  };

  const errorLoginMsg = (msg) => {
    toast.error(msg);
  };

  const successCreateUserMsg = () => {
    toast.success("Account Creation Successful!\nPlease login...");
  };

  const errorCreateUserMsg = (msg) => {
    toast.error(msg);
  };

  const successLogoutMsg = () => {
    toast.success("You've been logged out!");
  };


  return (
    <div className="container mx-auto px-4">
      <Toaster />
      {isLoggingIn ? (
        <div className="flex items-center justify-center">
          <div className="loader"></div>
          <h2 className="text-2xl font-bold mb-4 ml-4">Logging in...</h2>
        </div>
      ) : (
        <>
          {user && user.username ? (
            <h2 className="text-2xl font-bold mb-4">Welcome, {capitalizeFirstLetter(user.username)}!</h2>
          ) : (
            <h2 className="text-2xl font-bold mb-4">Welcome, sign in below!</h2>
          )}

          <button onClick={() => toggleForm('signup')} className="bg-blue-500 text-white p-2 rounded-md m-2">
            Create an Account
          </button>

          {isLoggedIn ? (

            user && user.username ? (
              <button
                onClick={() => {
                  const validUsername = user.username;
                  const userId = user.id;
                  router.push({
                    pathname: '/gamePage',
                    query: { userId, validUsername },
                  });
                }}
                className="bg-green-500 text-white p-2 rounded-md m-2"
              >
                Play Game
              </button>
            ) : (
              <div>Loading...</div>
            )
          ) : (
            <button onClick={() => toggleForm('login')} className="bg-blue-500 text-white p-2 rounded-md m-2">
              Have an Account Already? Sign In Here!
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {showForm === 'signup' && (
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <SignUp setShowForm={setShowForm} successCreateUserMsg={successCreateUserMsg} errorCreateUserMsg={errorCreateUserMsg}/>
              </div>
            )}
            {showForm === 'login' && !isLoggedIn && (
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-xl font-semibold mb-2">Log In</h3>
                <LogIn setShowForm={setShowForm} successLoginMsg={successLoginMsg} setIsLoggingIn={setIsLoggingIn} errorLoginMsg={errorLoginMsg}/>
              </div>
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

