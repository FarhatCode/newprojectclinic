import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import './Header.css';

export default function Header({ onOpenModal, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-container">
          <div className="top-bar-left">
            <MapPin size={14} />
            <span>{content?.address}</span>
          </div>
          <div className="top-bar-right">
            <Phone size={14} />
            <span>{content?.phone}</span>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-container">
          <Link to="/" className="logo" onClick={closeMenu} style={{ height: '70px', width: '130px' }}>
            <img src="logo.png" alt="" height={250} width={250} style={{ position: 'absolute', marginLeft: '-40px' }} />
          </Link>

          <div className={`nav-menu ${isOpen ? 'active' : ''} nav-menu-left`}>
            <Link to="/portfolio" className="nav-link" onClick={closeMenu}>Портфолио</Link>
            <Link to="/about" className="nav-link" onClick={closeMenu}>О нас</Link>
            <Link to="/services" className="nav-link" onClick={closeMenu}>Услуги</Link>
            <Link to="/prices" className="nav-link" onClick={closeMenu}>Цены</Link>
            <Link to="/reviews" className="nav-link" onClick={closeMenu}>Отзывы</Link>
            <Link to="/contacts" className="nav-link" onClick={closeMenu}>Контакты</Link>

          </div>

          <div className={`nav-menu ${isOpen ? 'active' : ''} nav-menu-right`}>
            <div className="social-icons">
              <a href={content?.whatsappLink} target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                <MessageCircle size={20} />
              </a>
              <a href={content?.telegramLink} target="_blank" rel="noopener noreferrer" className="social-link telegram">
                <Send size={20} />
              </a>
            </div>

            <button className="btn btn-primary nav-cta" onClick={() => { closeMenu(); onOpenModal(); }}>Записаться</button>
          </div>

          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>
    </>
  );
}
