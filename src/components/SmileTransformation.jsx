import React from 'react';
import './SmileTransformation.css';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function SmileTransformation({ data }) {
    if (!data) return null;

    return (
        <section className="smile-transformation section">
            <div className="container">
                <h2 className="section-title">Как преображаются улыбки наших пациентов</h2>

                <div className="transformation-grid">
                    {/* Column 1: Before/After */}
                    <div className="transform-col col-1">
                        <div className="transform-card before-after-card">
                            <img src={data?.column1?.image?.includes("http") ? VITE_UPLOADS_URL + data?.column1?.image : data?.column1?.image} alt="Result" className="transform-img" />
                            <h3 className="transform-card-title">{data?.column1?.title}</h3>
                        </div>
                    </div>

                    {/* Column 2: Info blocks */}
                    <div className="transform-col col-2">
                        <div className="info-block duration-block">
                            <span className="info-label">{data?.column2?.block1?.title}</span>
                            <span className="info-value">{data?.column2?.block1?.value}</span>
                        </div>
                        <div className="info-block price-block">
                            <span className="info-label">{data?.column2?.block2?.title}</span>
                            <span className="info-value">{data?.column2?.block2?.value}</span>
                        </div>
                    </div>

                    {/* Column 3: Doctor */}
                    <div className="transform-col col-3">
                        <div className="doctor-promo-card">
                            <div className="doctor-image-wrapper">
                                <img src="/hero.png" alt="Hero background" className="doctor-bg" />
                                <img src={data?.column3?.image?.includes("http") ? VITE_UPLOADS_URL + data?.column3?.image : data?.column3?.image} alt="Doctor" className="doctor-person" />
                                <div className="doctor-mask"></div>
                            </div>
                            <div className="doctor-info">
                                <h3>{data?.column3?.name}</h3>
                                <p>{data?.column3?.experience}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
