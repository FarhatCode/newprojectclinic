import React from 'react';

export default function Prices({ price }) {
    return (
        <div className="page-container container section">
            <h1 className="section-title">Цены</h1>
            <p className="section-subtitle">Прозрачная стоимость услуг</p>

            <div className="prices-list">
                {price && price.length > 0 ? (
                    price.map((category, idx) => (
                        <div className="price-category" key={idx}>
                            <h2>{category.title}</h2>
                            {category['text-price'] && (
                                <div className="price-item">
                                    <span>{category['text-price']}</span>
                                </div>
                            )}
                            {category['text-price-2'] && (
                                <div className="price-item">
                                    <span>{category['text-price-2']}</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Цены загружаются...</p>
                )}
            </div>
        </div>
    );
}
