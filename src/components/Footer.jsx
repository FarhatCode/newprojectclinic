import React from 'react';
import './Footer.css';

export default function Footer() {
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
                                <span>г. Тюмень, ул. Ленина, 50</span>
                            </div>
                            <div className="contact-item">
                                <span className="icon">📞</span>
                                <a href="tel:+79991234567">+7 (999) 123-45-67</a>
                            </div>
                            <div className="contact-item">
                                <span className="icon">✉️</span>
                                <a href="mailto:info@clinic.ru">info@clinicpremier.ru</a>
                            </div>
                        </div>

                        <div className="social-links">
                            <a href="#" className="social-icon">VK</a>
                            <a href="#" className="social-icon">TG</a>
                            <a href="#" className="social-icon">WA</a>
                        </div>
                    </div>

                    <form className="footer-form">
                        <h3 className="form-title">Записаться на прием</h3>
                        <div className="form-group">
                            <input type="text" placeholder="Ваше имя" required />
                        </div>
                        <div className="form-group">
                            <input type="tel" placeholder="Ваш телефон" required />
                        </div>
                        <button type="submit" className="btn btn-primary form-btn">Отправить заявку</button>
                        <p className="form-note">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
                    </form>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">
                        &copy; 2026 Clinic Premier. Все права защищены.
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
