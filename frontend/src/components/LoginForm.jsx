import React, { useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login/', { username, password });
      login(res.data.token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required
          className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          className="w-full p-2 border rounded" />
        <button type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default LoginForm;
