import React, { useState } from 'react';
import './Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-container">
        <a href="/" className="logo">
          Clinic<span className="logo-accent">Premier</span>
        </a>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <a href="#services" className="nav-link">Услуги</a>
          <a href="#doctors" className="nav-link">Врачи</a>
          <a href="#about" className="nav-link">О нас</a>
          <a href="#contact" className="nav-link">Контакты</a>
          <a href="tel:+79991234567" className="nav-phone">+7 (999) 123-45-67</a>
          <button className="btn btn-primary nav-cta">Записаться</button>
        </div>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </header>
  );
}
