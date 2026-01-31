import React from 'react';
import './InstagramSection.css';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function InstagramSection({ data }) {
    if (!data) return null;

    return (
        <section className="instagram-section section">
            <div className="container">
                <div className="instagram-container">
                    <img src={data?.image} alt="Instagram profile" className="instagram-image" />
                    <div className="insta-overlay">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="insta-btn">
                            Подписаться в Instagram
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
