import React from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await API.post('/logout/');
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      logout();
    }
  };

  return (
    <button onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
}

export default LogoutButton;
