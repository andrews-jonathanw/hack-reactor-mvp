require('dotenv').config();
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout';
import SignUp from '../components/signUp';
import LogIn from '../components/logIn';
import CursorGif from '../components/cursorGif';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../components/UserContext';
import { useRouter } from 'next/router';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function App() {
  const [showForm, setShowForm] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { userInfo } = useUser();
  const isLoggedIn = userInfo !== null;
  const prevIsLoggedInRef = useRef();

  useEffect(() => {
    if (userInfo !== null) {
      setUser(userInfo);
      setIsLoggingIn(false);
    } else {
      setUser(null);
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
    if (router.query.signIn) {
      toast.error("Login first to play the game!");
    }
    if (router.query.status === 'loggedOut') {
      toast.success("You've been logged out!");
    }
  }, [router.query]);

  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: {},
    });
  }, []);

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
    <div className="container relative mx-auto px-4 flex flex-col items-center justify-center h-screen">
      <CursorGif />
      <video autoPlay muted loop id="video-bg" className="">
        <source src="./media/main-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Toaster />

      {isLoggingIn ? (
        <div className="flex items-center">
          <div className="loader"></div>
          <h2 className="text-2xl font-bold mb-4 ml-4">Logging in...</h2>
        </div>
      ) : (
        <>
          {user && user.username ? (
            <h2 className="text-2xl text-white font-bold mb-4 mt-[-10%]">Welcome, {capitalizeFirstLetter(user.username)}!</h2>
          ) : (
            <h2 className="text-2xl  text-white font-bold mb-4 mt-[-10%]">Welcome, sign in below!</h2>
          )}

          <div className="flex flex-col items-center">
            {!isLoggedIn && (
              <button onClick={() => toggleForm('signup')} className="bg-blue-500 text-white p-2 rounded-md m-2">
                Create an Account
              </button>
            )}

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
                  className="bg-green-500 text-white p-4 rounded-md m-4"
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
          </div>

          <div className="flex flex-col items-center">
            {showForm === 'signup' && (
              <div className="bg-gray-100 p-4 rounded-md" style={{ transform: showForm === 'signup' ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.5s' }}>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <SignUp setShowForm={setShowForm} successCreateUserMsg={successCreateUserMsg} errorCreateUserMsg={errorCreateUserMsg}/>
              </div>
            )}
            {showForm === 'login' && !isLoggedIn && (
              <div className="bg-gray-100 p-4 rounded-md" style={{ transform: showForm === 'login' ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.5s' }}>
                <h3 className="text-xl font-semibold mb-2">Log In</h3>
                <LogIn setShowForm={setShowForm} successLoginMsg={successLoginMsg} setIsLoggingIn={setIsLoggingIn} errorLoginMsg={errorLoginMsg}/>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        #video-bg {
          position: absolute;
          top: 5%;
          left: 0;
          min-width: 100%;
          max-height: 75%;
          z-index: -1;
        }

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

