import React from 'react';
import './Hero.css';

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-background">
                <img src="/hero.png" alt="Dental Clinic Interior" />
                <div className="hero-overlay"></div>
            </div>

            <div className="container hero-content">
                <h1 className="hero-title">
                    Идеальная улыбка —<br />
                    <span className="text-highlight">ваша уверенность</span>
                </h1>
                <p className="hero-subtitle">
                    Современная стоматология Clinic Premier в Тюмени.
                    Лечение без боли, гарантия качества и забота о каждом пациенте.
                </p>
                <div className="hero-actions">
                    <button className="btn btn-primary hero-btn">Записаться на прием</button>
                    <button className="btn btn-outline hero-btn-secondary">Наши услуги</button>
                </div>

                <div className="hero-features">
                    <div className="feature-item">
                        <span className="feature-number">15+</span>
                        <span className="feature-desc">Лет опыта</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-number">10k+</span>
                        <span className="feature-desc">Довольных пациентов</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-number">24/7</span>
                        <span className="feature-desc">Поддержка</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
