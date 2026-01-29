import React, { useState } from 'react';
import './AppointmentModal.css';

export default function AppointmentModal({ isOpen, onClose }) {
    if (!isOpen) return null;

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
                    onClose();
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>Записаться на прием</h2>
                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-group">
                        <label>Ваше имя</label>
                        <input
                            type="text"
                            required
                            placeholder="Иван Иванов"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            type="tel"
                            required
                            placeholder="+7 (___) ___-__-__"
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
                    <button type="submit" className="btn btn-primary">Отправить</button>
                </form>
            </div>
        </div>
    );
}
