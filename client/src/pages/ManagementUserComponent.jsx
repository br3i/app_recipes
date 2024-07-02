// pages/ManagementUserComponent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManagementUserComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManagementUserComponent;
