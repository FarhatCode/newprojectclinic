import React from 'react';
const API_URL = import.meta.env.VITE_API_URL;

import { useState, useEffect } from 'react';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ author: '', text: '', rating: 5 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/reviews`)
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch reviews:", err);
                // Fallback to static data if backend is down
                setReviews([
                    { id: 1, author: 'Анна С.', text: 'Потрясающая клиника! Очень вежливый персонал.', rating: 5 },
                    { id: 2, author: 'Елена М.', text: 'Хожу сюда уже год, очень довольна.', rating: 5 }
                ]);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview)
            });
            if (res.ok) {
                const savedReview = await res.json();
                setReviews([...reviews, savedReview]);
                setNewReview({ author: '', text: '', rating: 5 });
                alert('Отзыв успешно добавлен!');
            }
        } catch (error) {
            console.error("Error posting review:", error);
            alert('Ошибка при отправке отзыва. Проверьте, запущен ли сервер.');
        }
    };

    return (
        <div className="page-container container section">
            <h1 className="section-title">Отзывы</h1>
            <p className="section-subtitle">Мнения наших любимых пациентов</p>

            <div className="grid grid-2">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="stars">{'★'.repeat(review.rating)}</div>
                        <p className="review-text">“{review.text}”</p>
                        <p className="review-author">{review.author}</p>
                    </div>
                ))}
            </div>

            <div className="review-form-section" style={{ marginTop: '4rem', maxWidth: '600px', margin: '4rem auto 0' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Оставить отзыв</h2>
                <form onSubmit={handleSubmit} className="review-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            value={newReview.author}
                            onChange={e => setNewReview({ ...newReview, author: e.target.value })}
                            required
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            placeholder="Ваш отзыв"
                            value={newReview.text}
                            onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                            required
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '100px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Оценка: </label>
                        <select
                            value={newReview.rating}
                            onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                        >
                            <option value="5">5 звезд</option>
                            <option value="4">4 звезды</option>
                            <option value="3">3 звезды</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Отправить отзыв</button>
                </form>
            </div>
        </div>
    );
}
