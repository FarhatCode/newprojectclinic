import React from 'react';
import Map from '../components/Map';
import { MessageCircle, Send } from 'lucide-react';
export default function ContactPage({ content }) {
    return (
        <div className="page-container container section">
            <h1 className="section-title">Контакты</h1>
            <div className="grid grid-2">
                <div className="contact-info">
                    <h2>Наш адрес</h2>
                    <p>{content?.contact?.address}</p>

                    <h2 style={{ marginTop: '2rem' }}>Телефоны</h2>
                    <p>{content?.contact?.phone}</p>

                    <h2 style={{ marginTop: '2rem' }}>Режим работы</h2>
                    <p>{content?.contact?.hours}</p>

                    <h2 style={{ marginTop: '2rem' }}>Email</h2>
                    <p>{content?.contact?.email}</p>

                    <h2 style={{ marginTop: '2rem' }}>Социальные сети</h2>
                    <div className="social-links">
                        <a href={content?.contact?.vk} className="social-icon">VK</a>
                        <a href={content?.contact?.tg} target="_blank" rel="noopener noreferrer" className="social-link telegram">
                            <Send size={20} />
                        </a>
                        <a href={content?.contact?.wa} target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                            <MessageCircle size={20} />
                        </a>
                    </div>
                </div>
                <div className="map-placeholder">
                    <Map data={content?.map}
                </div>
            </div>
        </div>
    );
}
