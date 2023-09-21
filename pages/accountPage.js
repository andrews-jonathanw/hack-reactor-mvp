import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../components/UserContext';
import { useRouter } from 'next/router';

function Account() {
  const [scores, setScores] = useState([]);
  const [hiscores, setHiScores] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fieldToUpdate, setFieldToUpdate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
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
          const recent = await axios.get(`http://localhost:5000/api/user-recent-highscores?username=${currentUsername}`);
          const highest = await axios.get(`http://localhost:5000/api/user-highscores?username=${currentUsername}`);
          setScores(recent.data);
          setHiScores(highest.data);
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
      let errorMessage = 'An unknown error occurred';
      if (error && error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
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
      <div className="w-full md:w-1/2 bg-gray-100 p-5 rounded-lg mr-5">
        <h2 className="text-2xl mb-5 font-semibold">Your Account</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Username:</p>
            <p className="font-medium">{userInfo?.username}</p>
          </div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{userInfo?.email}</p>
          </div>
          <div className="space-y-2">
            {fieldToUpdate !== 'username' && (
              <button onClick={() => handleUpdateClick('username')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Update Username
              </button>
            )}
            {fieldToUpdate === 'username' && (
              <>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Enter new username" className="border rounded py-2 px-3 w-full" />
                <div className="flex space-x-2">
                  <button onClick={() => updateAccount('username', newUsername)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                    Submit
                  </button>
                  <button onClick={handleCancelClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            {fieldToUpdate !== 'email' && (
              <button onClick={() => handleUpdateClick('email')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Update Email
              </button>
            )}
            {fieldToUpdate === 'email' && (
              <>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter new email" className="border rounded py-2 px-3 w-full" />
                <div className="flex space-x-2">
                  <button onClick={() => updateAccount('email', newEmail)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                    Submit
                  </button>
                  <button onClick={handleCancelClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            {fieldToUpdate !== 'password' && (
              <button onClick={() => handleUpdateClick('password')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Update Password
              </button>
            )}
            {fieldToUpdate === 'password' && (
              <>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="border rounded py-2 px-3 w-full" />
                <div className="flex space-x-2">
                  <button onClick={() => updateAccount('password', newPassword)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                    Submit
                  </button>
                  <button onClick={handleCancelClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full mt-5 md:mt-0 flex space-x-5">
        <div className="w-full md:w-2/4 p-5 rounded-lg bg-gray-100">
          <h2 className="text-2xl mb-5 font-semibold">Last 5 Game Scores</h2>
          <div className="space-y-2">
            <ul>
              {scores.map((score, index) => (
                <li key={index} className="mb-1">
                  <div className="bg-blue-500 text-white font-medium py-1 px-3 rounded">
                    {score.score}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full md:w-2/4 p-5 rounded-lg bg-gray-100">
          <h2 className="text-2xl mb-5 font-semibold">Highest 5 Game Scores</h2>
          <div className="space-y-2">
            <ul>
              {hiscores.map((score, index) => (
                <li key={index} className="mb-1">
                  <div className="bg-blue-500 text-white font-medium py-1 px-3 rounded flex justify-between items-center">
                    <span>{score.score}</span>
                    <span className="text-white text-sm">{new Date(score.created_at).toLocaleDateString('en-US')}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
