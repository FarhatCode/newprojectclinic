import React from 'react';
import './Doctors.css';

const doctors = [
    {
        name: 'Др. Елена Смирнова',
        specialty: 'Главный врач, Ортодонт',
        image: '/doctor.png'
    },
    {
        name: 'Др. Алексей Волков',
        specialty: 'Хирург-имплантолог',
        image: '/doctor.png' // Reusing for demo
    },
    {
        name: 'Др. Мария Ковалева',
        specialty: 'Детский стоматолог',
        image: '/doctor.png' // Reusing for demo
    }
];

export default function Doctors() {
    return (
        <section id="doctors" className="doctors section">
            <div className="container">
                <h2 className="section-title">Наши врачи</h2>
                <p className="section-subtitle">
                    Опытные специалисты, которым можно доверить самое ценное — ваше здоровье.
                </p>

                <div className="doctors-grid">
                    {doctors.map((doc, index) => (
                        <div className="doctor-card" key={index}>
                            <div className="doctor-image">
                                <img src={doc.image} alt={doc.name} />
                                <div className="doctor-overlay">
                                    <button className="btn btn-primary btn-sm">Записаться</button>
                                </div>
                            </div>
                            <div className="doctor-info">
                                <h3 className="doctor-name">{doc.name}</h3>
                                <p className="doctor-specialty">{doc.specialty}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
