import React from 'react';
import './Doctors.css';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function Doctors({ doctors }) {
    return (
        <section id="doctors" className="doctors section">
            <div className="container">
                <h2 className="section-title">Наши врачи</h2>
                <p className="section-subtitle">
                    Опытные специалисты, которым можно доверить самое ценное — ваше здоровье.
                </p>

                <div className="doctors-grid">
                    {doctors && doctors.map((doc, index) => (
                        <div className="doctor-card" key={index}>
                            <div className="doctor-image">
                                <img src={doc?.image?.includes("http") ? VITE_UPLOADS_URL + doc?.image : doc?.image} alt={doc?.name} />
                                <div className="doctor-overlay">
                                    <button className="btn btn-primary btn-sm" onClick={() => onOpenModal()}>Записаться</button>
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
