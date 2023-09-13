import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../components/UserContext';
import { useRouter } from 'next/router';

function Account() {
  const [scores, setScores] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fieldToUpdate, setFieldToUpdate] = useState(null);
  const { userInfo, setUserInfo, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!userInfo) {
        router.push('/?needLogin=true');
      }
    }
  }, [userInfo, isLoading, router]);

  useEffect(() => {

    const fetchUserScores = async () => {
      try {
        if (userInfo) {
          const currentUsername = userInfo.username;
          const response = await axios.get(`http://localhost:5000/api/user-highscores?username=${currentUsername}`);
          setScores(response.data);
        }
      } catch (error) {
        console.error('Error fetching user scores:', error);
      }
  };

    fetchUserScores();
  }, [userInfo]);

  const validateField = (field, value) => {
    if (field === 'username') {
      if (!value || value.length < 3) {
        toast.error("Username must be at least 3 characters long");
        return false;
      }

      if (value === userInfo?.username) {
        toast.error("New username can't be the same as the current username");
        return false;
      }
    }

    if (field === 'email') {
      if (!value.includes("@")) {
        toast.error("Please enter a valid email address");
        return false;
      }
      if (value === userInfo?.email) {
        toast.error("New email can't be the same as the current email");
        return false;
      }
    }

    if (field === 'password') {
      if (!value || value.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return false;
      }
      if (value === userInfo?.password) {
        toast.error("New password can't be the same as the current password");
        return false;
      }
    }

    return true;
  };

  const updateAccount = async (field, value) => {
    if (!validateField(field, value)) {
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:5000/api/update/${field}`, { value }, { withCredentials: true });
      if (response.status === 200) {
        toast.success("Update Successful!");

        setUserInfo({
          ...userInfo,
          [field]: value
        });

        if (field === 'username') setNewUsername('');
        if (field === 'email') setNewEmail('');
        if (field === 'password') setNewPassword('');
        setFieldToUpdate(null);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Error updating account');
    }
  };

  const handleUpdateClick = (field) => {
    setFieldToUpdate(field);
  };

  const handleCancelClick = () => {
    setFieldToUpdate(null);
  };

  return (
    <div className="container mx-auto mt-10 p-5 flex flex-col md:flex-row">
      <Toaster />
      <div className="w-full md:w-1/2 bg-gray-100 p-5 rounded-lg">
        <h2 className="text-2xl mb-5">Your Account</h2>
        <p className="mb-2">Username: {userInfo?.username}</p>
        <p className="mb-5">Email: {userInfo?.email}</p>
        <div className="flex flex-col space-y-2">
          {fieldToUpdate !== 'username' && (
            <button onClick={() => handleUpdateClick('username')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-2/4">Update Username</button>
          )}
          {fieldToUpdate === 'username' && (
            <div className="flex flex-col space-y-2">
              <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Enter new username" className="border rounded py-2 px-3 w-2/4" />
              <div className="flex space-x-2">
                <button onClick={() => updateAccount('username', newUsername)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                <button onClick={handleCancelClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
              </div>
            </div>
          )}
          {fieldToUpdate !== 'email' && (
            <button onClick={() => handleUpdateClick('email')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-2/4">Update Email</button>
          )}
          {fieldToUpdate === 'email' && (
            <div className="flex flex-col space-y-2">
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter new email" className="border rounded py-2 px-3 w-2/4" />
              <div className="flex space-x-2">
                <button onClick={() => updateAccount('email', newEmail)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                <button onClick={handleCancelClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
              </div>
            </div>
          )}
          {fieldToUpdate !== 'password' && (
            <button onClick={() => handleUpdateClick('password')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-2/4">Update Password</button>
          )}
          {fieldToUpdate === 'password' && (
            <div className="flex flex-col space-y-2">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="border rounded py-2 px-3 w-2/4" />
              <div className="flex space-x-2">
                <button onClick={() => updateAccount('password', newPassword)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                <button onClick={handleCancelClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-5 md:mt-0 md:ml-10 p-5 rounded-lg bg-gray-100">
        <h2 className="text-2xl mb-5">Last 5 Game Scores</h2>
        <ul>
          {scores.map((score, index) => (
            <li key={index} className="mb-1">{score.score}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Account;
