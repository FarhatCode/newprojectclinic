import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero({ onOpenModal, data }) {
    return (
        <section className="hero">
            <div className='hero-2-background'>
                <img src="/hero-2.png" alt="Dental Clinic Interior" />
                <div className="hero-2-overlay"></div>
            </div>
            <div className="hero-background">
                <img src="/hero.png" alt="Dental Clinic Interior" />
                <div className="hero-overlay"></div>
            </div>

            <div className="container hero-content">
                <div className="hero-text-block">
                    <h1 className="hero-title">
                        Идеальная улыбка —<br />
                        <span className="text-highlight">ваша уверенность</span>
                    </h1>
                    <p className="hero-subtitle">
                        Современная стоматология Clinic Premier в Тюмени.
                        Лечение без боли, гарантия качества и забота о каждом пациенте.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary hero-btn" onClick={() => onOpenModal()}>Записаться на прием</button>
                        <Link className="btn btn-outline hero-btn-secondary" to="/services">Наши услуги</Link>
                    </div>
                </div>

                <div className="hero-features">
                    <div className="feature-item">
                        <span className="feature-number">{data?.experience || '15+'}</span>
                        <span className="feature-desc">Лет опыта</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-number">{data?.patients || '10k+'}</span>
                        <span className="feature-desc">Довольных пациентов</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-number">{data?.support || '24/7'}</span>
                        <span className="feature-desc">Поддержка</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
