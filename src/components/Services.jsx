import React from 'react';
import './Services.css';

const servicesData = [
    {
        title: 'Терапия',
        desc: 'Лечение кариеса, пульпита и эстетическая реставрация зубов.',
        icon: '🦷' // Placeholder icon
    },
    {
        title: 'Имплантация',
        desc: 'Восстановление утраченных зубов с пожизненной гарантией.',
        icon: '🔧'
    },
    {
        title: 'Ортодонтия',
        desc: 'Исправление прикуса брекетами и элайнерами для детей и взрослых.',
        icon: '😁'
    },
    {
        title: 'Хирургия',
        desc: 'Безболезненное удаление зубов, пластика десны и костная пластика.',
        icon: 'scalpel' // using text/emoji for simplicity or SVG later
    },
    {
        title: 'Отбеливание',
        desc: 'Профессиональная гигиена и безопасное отбеливание ZOOM 4.',
        icon: '✨'
    },
    {
        title: 'Детский прием',
        desc: 'Лечение молочных зубов в игровой форме без слез и боли.',
        icon: '🧸'
    }
];

export default function Services() {
    return (
        <section id="services" className="services section">
            <div className="container">
                <h2 className="section-title">Наши услуги</h2>
                <p className="section-subtitle">
                    Комплексный подход к здоровью вашей улыбки. Мы предлагаем полный спектр стоматологических услуг.
                </p>

                <div className="services-grid">
                    {servicesData.map((service, index) => (
                        <div className="service-card" key={index}>
                            <div className="service-icon">{service.icon === 'scalpel' ? '💉' : service.icon}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-desc">{service.desc}</p>
                            <a href="#appointment" className="service-link">Подробнее &rarr;</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
