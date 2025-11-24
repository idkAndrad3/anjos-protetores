import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaw } from 'react-icons/fa';
import './Animal.css';
import Navbar from '../Navbar/Navbar';
import { TiArrowBackOutline } from 'react-icons/ti';
import Footer from '../Footer/Footer';

const MOCK_ANIMAIS = [
  {
    id: 1,
    nome: 'Rex',
    fotoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    specie: { name: 'Cachorro' },
    race: { name: 'Vira-lata' },
    idade: '2 anos',
    sexo: 'Macho',
    porte: 'Médio',
    description: 'O Rex é um cachorro muito brincalhão e cheio de energia. Adora correr no parque e pegar bolinhas. Se dá bem com crianças e outros cachorros.'
  },
  {
    id: 2,
    nome: 'Mia',
    fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    specie: { name: 'Gato' },
    race: { name: 'Siamês' },
    idade: '1 ano',
    sexo: 'Fêmea',
    porte: 'Pequeno',
    description: 'Mia é uma gatinha calma e carinhosa. Gosta de dormir no sol e receber carinho na cabeça. Ideal para apartamento.'
  },
  {
    id: 3,
    nome: 'Thor',
    fotoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    specie: { name: 'Cachorro' },
    race: { name: 'Beagle' },
    idade: '3 anos',
    sexo: 'Macho',
    porte: 'Médio',
    description: 'Thor é um explorador nato! Curioso e dócil, precisa de passeios diários para gastar energia.'
  }
];

const Animal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const animalEncontrado = MOCK_ANIMAIS.find(a => a.id === parseInt(id));
    setAnimal(animalEncontrado);
    setLoading(false);
  }, [id]);

  const handleVoltar = () => {
    navigate(-1); 
  };

  if (loading) return <div className="loading">Carregando...</div>;

  if (!animal) {
    return (
      <>
        <Navbar />
        <div className="default-container padding-container error-container">
          <h2>Animal não encontrado 😕</h2>
          <button onClick={handleVoltar} className="btn-voltar">Voltar</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className='section-animal'>
        <div className="default-container padding-container">

          <div className="detalhes-wrapper">
            <button onClick={handleVoltar} className="back-icon" title="Voltar">
              <TiArrowBackOutline />
            </button>
            <div className="detalhes-imagem-container">

              <img
                src={animal.fotoUrl}
                alt={animal.nome}
                className="detalhes-foto"
              />
            </div>

            <div className="detalhes-info-container">

              <h1 className="detalhes-titulo">{animal.nome}</h1>

              <div className="tags-container">
                <span className="tag especie">{animal.specie.name}</span>
                <span className="tag raca">{animal.race.name}</span>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <strong>Idade:</strong>
                  <span>{animal.idade}</span>
                </div>
                <div className="info-item">
                  <strong>Sexo:</strong>
                  <span>{animal.sexo}</span>
                </div>
                <div className="info-item">
                  <strong>Porte:</strong>
                  <span>{animal.porte}</span>
                </div>
              </div>

              <div className="descricao-section">
                <h3>Sobre o {animal.nome}</h3>
                <p>{animal.description}</p>
              </div>

              <button className="btn-adotar-grande">
                <FaPaw /> Quero Adotar o {animal.nome}
              </button>
            </div>
          </div>
        </div>
      <Footer />
      </div>
    </>
  );
};

export default Animal;