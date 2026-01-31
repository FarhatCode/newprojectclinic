import React, { useState, useEffect } from 'react';
import './Services.css';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function Services({ data }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/services`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setServices(data);
                } else {
                    setServices([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch services:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section id="services" className="services section">
            <div className="container">
                <h2 className="section-title">Наши услуги</h2>
                <p className="section-subtitle">
                    Комплексный подход к здоровью вашей улыбки. Мы предлагаем полный спектр стоматологических услуг.
                </p>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index}>
                            <img src={service?.icon} alt="Service Icon" className='service-icon' />
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-desc">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
