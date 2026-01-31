import React, { useEffect, useRef } from 'react';
import './VisualDiagnostics.css';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function VisualDiagnostics({ data }) {
    if (!data) return null;
    const gallery1Ref = useRef(null);
    const gallery2Ref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (gallery1Ref.current) {
                gallery1Ref.current.style.transform = `translateX(${(scrollY * 0.2) - 1600}px)`;
            }
            if (gallery2Ref.current) {
                gallery2Ref.current.style.transform = `translateX(-${(scrollY * 0.2)}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="visual-diagnostics">
            <div className="section-background">
                <img src="/hero.png" alt="background" />
                <div className="overlay"></div>
            </div>

            <div className="container">
                <div className="visual-header">
                    <h2 className="section-title">{data.title}</h2>
                    <p className="visual-subtitle">{data.text}</p>
                </div>
            </div>

            <div className="galleries-container">
                <div className="gallery-track track-right" ref={gallery1Ref}>
                    {(data.gallery1 || []).concat(data.gallery1 || []).map((img, i) => (
                        <div key={`g1-${i}`} className="gallery-item">
                            <img src={img} alt="Clinic interior" />
                        </div>
                    ))}
                </div>
                <div className="gallery-track track-left" ref={gallery2Ref}>
                    {(data.gallery2 || []).concat(data.gallery2 || []).map((img, i) => (
                        <div key={`g2-${i}`} className="gallery-item">
                            <img src={img} alt="Clinic equipment" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
