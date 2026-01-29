import React from 'react';

export default function Portfolio({ portfolio }) {
    return (
        <div className="page-container container section">
            <h1 className="section-title">Наши работы</h1>
            <p className="section-subtitle">Результаты преображения наших пациентов</p>
            <div className="grid grid-3">
                {portfolio && portfolio.length > 0 ? (
                    portfolio.map((item, index) => (
                        <div key={index} className="portfolio-item">
                            <img src={item.image} alt={`Работа ${index + 1}`} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', height: '300px' }} />
                        </div>
                    ))
                ) : (
                    <p>Работы загружаются...</p>
                )}
            </div>
        </div>
    );
}
