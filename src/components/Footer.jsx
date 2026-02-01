import React, { useState } from 'react';
import './Footer.css';

export default function Footer({ content }) {
    const [formData, setFormData] = useState({ name: '', phone: '', comment: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (res.ok) {
                    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                    setFormData({ name: '', phone: '', comment: '' });
                } else {
                    alert('Ошибка при отправке заявки.');
                }
            })
            .catch(err => {
                console.error(err);
                alert('Ошибка сети.');
            });
    };

    return (
        <footer id="contact" className="site-footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-contact-info">
                        <h2 className="footer-title">Свяжитесь с нами</h2>
                        <p className="footer-desc">
                            Запишитесь на прием прямо сейчас и получите бесплатную консультацию.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <span className="icon">📍</span>
                                <span>{content?.address}</span>
                            </div>
                            <div className="contact-item">
                                <span className="icon">📞</span>
                                <a href={`tel:${content?.phone.replace(/\D/g, '')}`}>{content?.phone}</a>
                            </div>
                            <div className="contact-item">
                                <span className="icon">✉️</span>
                                <a href={`mailto:${content?.email}`}>{content?.email}</a>
                            </div>
                            <div className="contact-item">
                                <span className="icon">🕒</span>
                                <span>{content?.hours}</span>
                            </div>
                        </div>

                        <div className="social-links">
                            <a href={content?.vk} className="social-icon">VK</a>
                            <a href={content?.tg} className="social-icon">TG</a>
                            <a href={content?.wa} className="social-icon">WA</a>
                        </div>
                    </div>

                    <form className="footer-form" onSubmit={handleSubmit}>
                        <h3 className="form-title">Записаться на прием</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Ваше имя"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                placeholder="Ваш телефон"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Комментарий</label>
                            <textarea
                                placeholder="Желаемая процедура или время"
                                value={formData.comment}
                                onChange={e => setFormData({ ...formData, comment: e.target.value })}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary form-btn" >Отправить заявку</button>
                        <p className="form-note">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
                    </form>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">
                        &copy; 2026 CONCEPT CLINIC. Все права защищены.
                    </div>
                    <div className="footer-nav">
                        <a href="#">Политика конфиденциальности</a>
                        <a href="#">Лицензия</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
