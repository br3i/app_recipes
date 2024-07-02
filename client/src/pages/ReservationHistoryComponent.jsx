import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationHistoryComponent = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await axios.get('/api/historialReservas');
      setHistory(response.data);
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h1>Reservation History</h1>
      <ul>
        {history.map((item) => (
          <li key={item.id}>{item.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationHistoryComponent;
