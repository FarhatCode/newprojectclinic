import React, { useEffect, useRef } from 'react';
import './VisualDiagnostics.css';

const galleryImages = [
    { id: 1, src: '/about.png' },
    { id: 2, src: '/hero.png' },
    { id: 3, src: '/hero-2.png' },
    { id: 4, src: '/about.png' },
    { id: 5, src: '/hero.png' },
    { id: 6, src: '/hero-2.png' },
];

export default function VisualDiagnostics({ data }) {
    if (!data) return null;
    const gallery1Ref = useRef(null);
    const gallery2Ref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (gallery1Ref.current) {
                gallery1Ref.current.style.transform = `translateX(${scrollY * 0.1}px)`;
            }
            if (gallery2Ref.current) {
                gallery2Ref.current.style.transform = `translateX(-${scrollY * 0.1}px)`;
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
