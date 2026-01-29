import React from 'react';
import './Diagnostics.css';

export default function Diagnostics({ data }) {
    if (!data) return null;

    return (
        <section className="diagnostics section">
            <div className="container">
                <h2 className="section-title diagnostics-title">{data.title}</h2>
                <div className="diagnostics-grid">
                    {data.cards?.map((card, index) => (
                        <div key={card.id || index} className="diagnostic-card">
                            <span className="card-number">{index + 1}</span>
                            <p className="card-text">{card.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
