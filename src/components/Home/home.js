import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="home-container">
        <h1>Bienvenido a LanguageConnect</h1>
        <p>¡Aprende idiomas conectando con personas de todo el mundo!</p>
        <p>
          LanguageConnect es una plataforma única diseñada para aquellos que
          desean mejorar sus habilidades lingüísticas de una manera divertida e
          interactiva. Conecta con otros usuarios en tiempo real a través de
          videollamadas aleatorias, practica el idioma que deseas aprender y
          ayuda a otros a mejorar sus habilidades en tu idioma nativo.
        </p>
        <p>
          Explora perfiles, conéctate con usuarios interesados en intercambiar
          idiomas, y mejora juntos de manera equitativa. Ya seas principiante o
          avanzado, LanguageConnect es el lugar perfecto para ti.
        </p>

        <Link to="/videoChat">
          <button className="home-btn">Empezar</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
