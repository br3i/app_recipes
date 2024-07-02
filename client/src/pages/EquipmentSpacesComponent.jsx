import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EquipmentSpacesComponent = () => {
  const [equipmentSpaces, setEquipmentSpaces] = useState([]);

  useEffect(() => {
    const fetchEquipmentSpaces = async () => {
      const response = await axios.get('/api/equiposEspacios');
      setEquipmentSpaces(response.data);
    };

    fetchEquipmentSpaces();
  }, []);

  return (
    <div>
      <h1>Equipment Spaces</h1>
      <ul>
        {equipmentSpaces.map((item) => (
          <li key={item.id}>
            Equipo: {item.equipo_id}, Espacio: {item.espacio_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentSpacesComponent;
