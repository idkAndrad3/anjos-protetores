import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getAllAnimals } from '../../services/animalService';
import './AdoptionsManager.css';

const AdoptionsManager = () => {
  const navigate = useNavigate();

  const [animals, setAnimals] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedAnimalDetails, setSelectedAnimalDetails] = useState(null);

  // Carrega lista de animais para o filtro
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const data = await getAllAnimals();
        setAnimals(data || []);
      } catch (e) {
        console.error(e);
        alert('Não foi possível carregar a lista de animais.');
      }
    };
    loadAnimals();
  }, []);

  // Carrega pedidos para um animal específico
  const loadRequests = async (animalId) => {
    if (!animalId) {
      setRequests([]);
      return;
    }
    setLoadingRequests(true);
    try {
      const { data } = await api.get(`/api/pvt/adoptionRequests/${animalId}`);
      setRequests(data || []);
    } catch (e) {
      console.error(e);
      alert('Não foi possível carregar os pedidos de adoção para este animal.');
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAnimalChange = (event) => {
    const id = event.target.value;
    setSelectedAnimalId(id);
    setSelectedAnimalDetails(null);
    loadRequests(id);
  };

  // Ver detalhes completos do animal
  const handleViewAnimal = async (animalId) => {
    try {
      const { data } = await api.get(`/api/pub/animals/${animalId}`);
      setSelectedAnimalDetails(data);
    } catch (e) {
      console.error(e);
      alert('Não foi possível carregar os detalhes do animal.');
    }
  };

  // Aprovar adoção
  const handleApprove = async (animalId) => {
    if (!animalId) return;
    const ok = window.confirm('Confirmar adoção para este solicitante?');
    if (!ok) return;

    try {
      await api.put(`/api/pvt/adoptionRequests/${animalId}`);
      alert('Adoção aprovada com sucesso!');
      loadRequests(animalId);
    } catch (e) {
      console.error(e);
      alert('Falha ao aprovar a adoção.');
    }
  };

  return (
    <div className="manager-container">
      <div className="adoptions-header">
        <h2>Pedidos de Adoção</h2>
        <p>Selecione um animal para visualizar os pedidos e definir o adotante.</p>
      </div>

      <div className="adoptions-toolbar">
        <div className="adoptions-filter">
          <label htmlFor="animalSelect">Animal:</label>
          <select
            id="animalSelect"
            value={selectedAnimalId}
            onChange={handleAnimalChange}
          >
            <option value="">Selecione um animal</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="adoptions-content">
        {loadingRequests ? (
          <p>Carregando pedidos...</p>
        ) : !selectedAnimalId ? (
          <p>Selecione um animal para ver os pedidos de adoção.</p>
        ) : requests.length === 0 ? (
          <p>Não há pedidos de adoção para este animal.</p>
        ) : (
          <table className="adoptions-table">
            <thead>
              <tr>
                <th>Adotante</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Status do Animal</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr key={idx}>
                  <td>{req.adopter?.name}</td>
                  <td>{req.adopter?.email}</td>
                  <td>{req.adopter?.phone}</td>
                  <td>{req.adopter?.address}</td>
                  <td>{req.animal?.status}</td>
                  <td className="adoptions-actions">
                    <button
                      className="btn-view"
                      type="button"
                      onClick={() => handleViewAnimal(req.animal?.id)}
                    >
                      Ver animal
                    </button>
                    <button
                      className="btn-approve"
                      type="button"
                      onClick={() => handleApprove(req.animal?.id)}
                    >
                      Aprovar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedAnimalDetails && (
        <div className="animal-details-card">
          <h3>Detalhes do Animal</h3>
          <p><strong>Nome:</strong> {selectedAnimalDetails.name}</p>
          <p><strong>Status:</strong> {selectedAnimalDetails.status}</p>
          <p><strong>Espécie:</strong> {selectedAnimalDetails.specie?.name}</p>
          <p><strong>Raça:</strong> {selectedAnimalDetails.race?.name}</p>
          <p><strong>Descrição:</strong> {selectedAnimalDetails.description}</p>
        </div>
      )}
    </div>
  );
};

export default AdoptionsManager;
