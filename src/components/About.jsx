import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';

export default function About({ data }) {
    return (
        <section id="about" className="about section">
            <div className="container about-container">
                <div className="about-image">
                    <img src="/about.png" alt="Our Medical Team" />
                    <div className="about-badge">
                        <div className="badge-number">{data?.patients}</div>
                        <div className="badge-text">Здоровых улыбок</div>
                    </div>
                </div>

                <div className="about-content">
                    <h2 className="section-title text-left">О нашей клинике</h2>
                    <p className="about-text">
                        Clinic Premier — это команда профессионалов, которые горят своим делом.
                        Мы объединили передовые технологии, уютную атмосферу и многолетний опыт,
                        чтобы ваше лечение было максимально комфортным и эффективным.
                    </p>

                    <ul className="about-list">
                        <li>
                            <span className="check-icon">✓</span>
                            <span>Современное оборудование из Германии и Швейцарии</span>
                        </li>
                        <li>
                            <span className="check-icon">✓</span>
                            <span>Врачи с опытом работы более 10 лет</span>
                        </li>
                        <li>
                            <span className="check-icon">✓</span>
                            <span>Гарантия на все виды работ</span>
                        </li>
                        <li>
                            <span className="check-icon">✓</span>
                            <span>Честные цены без скрытых платежей</span>
                        </li>
                    </ul>

                    <Link to="/about" className="btn btn-primary about-btn">Познакомиться с командой</Link>
                </div>
            </div>
        </section>
    );
}
