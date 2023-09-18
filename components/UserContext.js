import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('ec2-3-22-234-154.us-east-2.compute.amazonaws.com:5000/api/rehydrate', { withCredentials: true })
      .then(response => {
        console.log("Received data:", response.data);
        if (response.data) {
          setUserInfo(response.data.user);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load user info:', error);
        setIsLoading(false);
      });
  }, []);


  const value = {
    userInfo,
    setUserInfo,
    isLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};


