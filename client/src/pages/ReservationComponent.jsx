// pages/ReservationComponent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservationComponent = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const response = await axios.get('/api/reservations');
      setReservations(response.data);
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <h2>Reservations</h2>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>{reservation.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationComponent;
