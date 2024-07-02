// pages/SpaceComponent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SpaceComponent = () => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [assignedEquipments, setAssignedEquipments] = useState([]);

  useEffect(() => {
    const fetchSpaces = async () => {
      const response = await axios.get('/api/spaces');
      setSpaces(response.data);
    };

    fetchSpaces();
  }, []);

  const handleSpaceSelect = async (spaceId) => {
    setSelectedSpace(spaceId);
    const response = await axios.get(`/api/spaces/${spaceId}/equipments`);
    setAssignedEquipments(response.data);
    const availableResponse = await axios.get('/api/equipments');
    setAvailableEquipments(availableResponse.data);
  };

  const handleAssignEquipment = async (equipmentId) => {
    await axios.post(`/api/spaces/${selectedSpace}/equipments`, { equipmentId });
    const response = await axios.get(`/api/spaces/${selectedSpace}/equipments`);
    setAssignedEquipments(response.data);
  };

  const handleRemoveEquipment = async (equipmentId) => {
    await axios.delete(`/api/spaces/${selectedSpace}/equipments/${equipmentId}`);
    const response = await axios.get(`/api/spaces/${selectedSpace}/equipments`);
    setAssignedEquipments(response.data);
  };

  return (
    <div>
      <h2>Spaces</h2>
      <div>
        <h3>Available Spaces</h3>
        <ul>
          {spaces.map((space) => (
            <li key={space.id} onClick={() => handleSpaceSelect(space.id)}>
              {space.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedSpace && (
        <div>
          <h3>Assigned Equipments for {spaces.find((s) => s.id === selectedSpace)?.name}</h3>
          <ul>
            {assignedEquipments.map((equipment) => (
              <li key={equipment.id}>
                {equipment.name}
                <button onClick={() => handleRemoveEquipment(equipment.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Assign New Equipment</h3>
          <ul>
            {availableEquipments.map((equipment) => (
              <li key={equipment.id}>
                {equipment.name}
                <button onClick={() => handleAssignEquipment(equipment.id)}>Assign</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpaceComponent;
