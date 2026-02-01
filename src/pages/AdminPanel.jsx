import { useEffect, useState } from "react";
import Diagnostics from "../components/Diagnostics";
import SmileTransformation from "../components/SmileTransformation";
const API_URL = import.meta.env.VITE_API_URL;
const VITE_UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ title: '', desc: '', icon: './tooth.png' });
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        if (isAuthenticated) {
            fetchServices();
            fetchContent();
            fetchReviews();
            fetchAppointments();
        }
    }, [isAuthenticated]);

    const fetchContent = () => {
        setLoading(true);
        fetch(`${API_URL}/content`)
            .then(res => res.json())
            .then(data => {
                if (!data.visualDiagnostics) {
                    data.visualDiagnostics = {
                        title: 'Визуальная диагностика',
                        text: 'В нашей клинике...',
                        gallery1: [],
                        gallery2: []
                    };
                }
                if (!data.map) data.map = { iframe: '', link: '' };
                if (!data.doctors) data.doctors = [];
                if (!data.portfolio) data.portfolio = [];
                if (!data.price) data.price = [];
                if (!data.instagram) data.instagram = { image: '', link: '' };
                if (data.instagram && !data.instagram.link) data.instagram.link = '';
                if (!data.contact) data.contact = { address: '', phone: '', email: '', hours: '', vk: '', tg: '', wa: '' };

                setContent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const fetchServices = () => {
        fetch(`${API_URL}/services`)
            .then(res => res.json())
            .then(data => setServices(data))
            .catch(console.error);
    };

    const [reviews, setReviews] = useState([]);
    const fetchReviews = () => {
        fetch(`${API_URL}/reviews`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(console.error);
    };

    const [appointments, setAppointments] = useState([]);
    const fetchAppointments = () => {
        fetch(`${API_URL}/appointments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(console.error);
    };

    const handleDeleteReview = (id) => {
        if (!confirm('Удалить отзыв?')) return;
        fetch(`${API_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                setReviews(reviews.filter(r => r.id !== id));
            })
            .catch(console.error);
    };

    const updateNestedContent = (section, path, value) => {
        setContent(prev => {
            const newContent = structuredClone(prev);
            if (section === 'portfolio') {
                newContent[section] = value;
                return newContent;
            }
            if (!newContent[section]) newContent[section] = {};
            let current = newContent[section];
            for (let i = 0; i < path.length - 1; i++) {
                if (!current[path[i]]) current[path[i]] = {};
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newContent;
        });
    };

    const addItemToArray = (section, path, newItem) => {
        setContent(prev => {
            const newContent = structuredClone(prev);
            if (!newContent[section]) newContent[section] = {};
            let current = newContent[section];
            for (let i = 0; i < path.length; i++) {
                if (!current[path[i]]) current[path[i]] = [];
                current = current[path[i]];
            }
            current.push(newItem);
            return newContent;
        });
    };

    const removeItemFromArray = (section, path, index) => {
        setContent(prev => {
            const newContent = structuredClone(prev);
            let current = newContent[section];
            for (let i = 0; i < path.length; i++) {
                current = current[path[i]];
            }
            current.splice(index, 1);
            return newContent;
        });
    };

    const handleFileUpload = async (e, callback) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${VITE_UPLOADS_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                callback(data.url);
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Ошибка при загрузке файла');
        }
    };

    const saveSectionToServer = async (section) => {
        try {
            const data = content[section];
            let response;

            const hasFile = data.steps?.some(step => step.image?.file instanceof File);

            if (hasFile && section === 'veneersSteps') {
                const formData = new FormData();
                formData.append("section", section);
                formData.append("title", data.title);

                const stepsWithoutFiles = data.steps.map(step => ({
                    id: step.id,
                    title: step.title,
                    textOriginal: step.textOriginal,
                    textResult: step.textResult
                }));
                formData.append("steps", JSON.stringify(stepsWithoutFiles));

                data.steps.forEach((step, idx) => {
                    if (step.image?.file instanceof File) {
                        formData.append(`file_${idx}`, step.image.file);
                    }
                });

                response = await fetch(`${API_URL}/content`, {
                    method: "POST",
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
            } else {
                const preparedData = {
                    ...data,
                    gallery1: data.gallery1,
                    gallery2: data.gallery2
                };
                response = await fetch(`${API_URL}/content`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ section, data: preparedData })
                });
            }

            if (response.ok) {
                alert(`Секция "${section}" сохранена!`);
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Ошибка при сохранении!");
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setToken(data.token);
                    setIsAuthenticated(true);
                    setPassword('');
                } else {
                    alert('Неверный пароль!');
                }
            })
            .catch(err => {
                console.error(err);
                alert('Ошибка при входе');
            });
    };

    const handleAddService = (e) => {
        e.preventDefault();
        fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newService)
        })
            .then(res => res.json())
            .then(saved => {
                setServices([...services, saved]);
                setNewService({ title: '', desc: '', icon: './tooth.png' });
                alert('Услуга добавлена!');
            });
    };

    const handleDeleteService = (id) => {
        fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                setServices(services.filter(s => s.id !== id));
                alert('Услуга удалена!');
            })
            .catch(console.error);
    };

    const handleUpdateAppointmentStatus = (id, newStatus) => {
        fetch(`${API_URL}/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(updated => {
                setAppointments(appointments.map(a => a.id === id ? updated : a));
            })
            .catch(console.error);
    };

    const handleDeleteAppointment = (id) => {
        if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;
        fetch(`${API_URL}/appointments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                setAppointments(appointments.filter(a => a.id !== id));
            })
            .catch(console.error);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            alert('Пароль слишком короткий (минимум 6 символов)');
            return;
        }

        fetch(`${API_URL}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newPassword })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Пароль успешно изменен!');
                    setToken(newPassword); // Update token to stay logged in
                    setNewPassword('');
                } else {
                    alert('Ошибка при смене пароля: ' + data.error);
                }
            })
            .catch(err => {
                console.error(err);
                alert('Ошибка при смене пароля');
            });
    };

    if (!isAuthenticated) {
        return (
            <div className="container section" style={{ maxWidth: '400px', marginTop: '4rem' }}>
                <h1 className="section-title">Вход в админку</h1>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                    <button type="submit" className="btn btn-primary">Войти</button>
                </form>
            </div>
        );
    }

    if (loading || !content) return <div className="container section">Загрузка данных...</div>;

    return (
        <div className="container section">
            <h1 className="section-title">Панель администратора</h1>

            <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('services')}>Услуги</button>
                <button className={`btn ${activeTab === 'reviews' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('reviews')}>Отзывы</button>
                <button className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('appointments')}>Заявки</button>
                <button className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('content')}>Контент</button>
                <button className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('settings')}>Настройки</button>
            </div>

            {activeTab === 'services' && (
                <div className="admin-section">
                    <h2>Управление услугами</h2>
                    <div className="grid grid-2" style={{ marginTop: '1rem' }}>
                        {services.map(service => (
                            <div key={service.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                                {service.icon && <img src={service.icon} alt={service.title} style={{ height: '200px', borderRadius: '8px' }} />}
                                <div style={{ fontSize: '2rem' }}>{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <button onClick={() => handleDeleteService(service.id)} className="btn btn-danger">Удалить</button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddService} style={{ marginTop: '2rem', padding: '2rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <h3>Добавить новую услугу</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Название услуги"
                                value={newService.title}
                                onChange={e => setNewService({ ...newService, title: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <input
                                type="text"
                                placeholder="Описание"
                                value={newService.desc}
                                onChange={e => setNewService({ ...newService, desc: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Иконка (URL)"
                                    value={newService.icon}
                                    onChange={e => setNewService({ ...newService, icon: e.target.value })}
                                    required
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                                <label className="btn btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    Загрузить файл
                                    <input type="file" hidden onChange={e => handleFileUpload(e, url => setNewService({ ...newService, icon: url }))} />
                                </label>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Добавить</button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="admin-section">
                    <h2>Управление отзывами</h2>
                    <div className="grid grid-2" style={{ marginTop: '1rem' }}>
                        {reviews.map(review => (
                            <div key={review.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                                <strong>{review.author}</strong> ({review.rating}★)
                                <p>{review.text}</p>
                                <button onClick={() => handleDeleteReview(review.id)} className="btn btn-danger">Удалить</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div className="admin-section">
                    <h2>Заявки с сайта</h2>
                    <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                        {appointments.length === 0 ? <p>Заявок пока нет</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '1rem' }}>Дата</th>
                                        <th style={{ padding: '1rem' }}>Имя</th>
                                        <th style={{ padding: '1rem' }}>Телефон</th>
                                        <th style={{ padding: '1rem' }}>Комментарий</th>
                                        <th style={{ padding: '1rem' }}>Статус</th>
                                        <th style={{ padding: '1rem' }}>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(app => {
                                        let rowStyle = { borderBottom: '1px solid #eee' };
                                        let badgeStyle = {
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase'
                                        };

                                        if (app.status === 'processed') {
                                            rowStyle.background = '#f0fdf4';
                                            rowStyle.color = '#166534';
                                            badgeStyle.background = '#dcfce7';
                                            badgeStyle.color = '#166534';
                                        } else if (app.status === 'spam') {
                                            rowStyle.background = '#fef2f2';
                                            rowStyle.color = '#991b1b';
                                            rowStyle.textDecoration = 'line-through opacity(0.5)';
                                            badgeStyle.background = '#fee2e2';
                                            badgeStyle.color = '#991b1b';
                                        } else if (app.status === 'expired') {
                                            rowStyle.background = '#f8fafc';
                                            rowStyle.color = '#64748b';
                                            badgeStyle.background = '#f1f5f9';
                                            badgeStyle.color = '#64748b';
                                        } else {
                                            // 'new'
                                            rowStyle.background = '#eff6ff';
                                            badgeStyle.background = '#dbeafe';
                                            badgeStyle.color = '#1e40af';
                                        }

                                        return (
                                            <tr key={app.id} style={rowStyle}>
                                                <td style={{ padding: '1rem' }}>{new Date(app.date).toLocaleString()}</td>
                                                <td style={{ padding: '1rem' }}>{app.name}</td>
                                                <td style={{ padding: '1rem' }}>{app.phone}</td>
                                                <td style={{ padding: '1rem' }}>{app.comment}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <select
                                                        value={app.status || 'new'}
                                                        onChange={(e) => handleUpdateAppointmentStatus(app.id, e.target.value)}
                                                        style={{
                                                            padding: '0.4rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid #ddd',
                                                            ...badgeStyle
                                                        }}
                                                    >
                                                        <option value="new">Новая</option>
                                                        <option value="processed">Обработана</option>
                                                        <option value="spam">Спам</option>
                                                        <option value="expired">Просрочена</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <button
                                                        onClick={() => handleDeleteAppointment(app.id)}
                                                        className="btn btn-danger btn-sm"
                                                        style={{ padding: '0.4rem 0.8rem' }}
                                                    >
                                                        Удалить
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'content' && (
                <div className="admin-section">
                    <div className="admin-grid" style={{ display: 'grid', gap: '2rem' }}>
                        {/* Header Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Шапка / Header</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('header')}>Сохранить</button>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                <label>Телефон: <input type="text" value={content.header?.phone} onChange={e => updateNestedContent('header', ['phone'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>Адрес: <input type="text" value={content.header?.address} onChange={e => updateNestedContent('header', ['address'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>Telegram URL: <input type="text" value={content.header?.telegramLink} onChange={e => updateNestedContent('header', ['telegramLink'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>WhatsApp URL: <input type="text" value={content.header?.whatsappLink} onChange={e => updateNestedContent('header', ['whatsappLink'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Цифры (Hero)</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('heroStats')}>Сохранить Цифры</button>
                            </div>

                            <div className="container hero-content" style={{ background: 'url(/hero.png)', padding: '20px', marginTop: '20px', marginBottom: '20px', borderRadius: '12px' }}>
                                <div className="hero-features" style={{ marginTop: '0px' }}>
                                    <div className="feature-item">
                                        <span className="feature-number">{content.heroStats.experience || '15+'}</span>
                                        <span className="feature-desc">Лет опыта</span>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-number">{content.heroStats.patients || '10k+'}</span>
                                        <span className="feature-desc">Довольных пациентов</span>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-number">{content.heroStats.support || '24/7'}</span>
                                        <span className="feature-desc">Поддержка</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Опыт:</label>
                                    <input type="text" value={content.heroStats.experience} onChange={e => updateNestedContent('heroStats', ['experience'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Пациенты:</label>
                                    <input type="text" value={content.heroStats.patients} onChange={e => updateNestedContent('heroStats', ['patients'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Поддержка:</label>
                                    <input type="text" value={content.heroStats.support} onChange={e => updateNestedContent('heroStats', ['support'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                            </div>
                        </div>

                        {/* Diagnostics Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Диагностика (Список)</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('diagnostics')}>Сохранить</button>
                            </div>
                            <Diagnostics data={content.diagnostics} />
                            <label>Заголовок: <input type="text" value={content.diagnostics?.title} onChange={e => updateNestedContent('diagnostics', ['title'], e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }} /></label>
                            {content.diagnostics?.cards?.map((card, idx) => (
                                <div key={card.id} style={{ marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={card.text}
                                        onChange={e => {
                                            const newCards = [...content.diagnostics.cards];
                                            newCards[idx].text = e.target.value;
                                            updateNestedContent('diagnostics', ['cards'], newCards);
                                        }}
                                        style={{ width: '100%', padding: '0.5rem' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Visual Diagnostics (Galleries) */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Визуальная диагностика (Галереи)</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('visualDiagnostics')}>Сохранить</button>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <label>Заголовок: <input type="text" value={content.visualDiagnostics?.title} onChange={e => updateNestedContent('visualDiagnostics', ['title'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>Текст: <textarea value={content.visualDiagnostics?.text} onChange={e => updateNestedContent('visualDiagnostics', ['text'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} rows="2" /></label>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label>Галерея 1 (URLs - по одному в строке):</label>
                                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                        + Загрузить файл в галерею 1
                                        <input type="file" hidden onChange={e => handleFileUpload(e, url => {
                                            const current = content.visualDiagnostics?.gallery1 || [];
                                            updateNestedContent('visualDiagnostics', ['gallery1'], [...current, url]);
                                        })} />
                                    </label>
                                </div>
                                {content.visualDiagnostics?.gallery1.map((url, idx) => <img key={idx} src={url} alt="preview" style={{ height: '100px', objectFit: 'contain', marginTop: '0.5rem' }} />)}
                                <textarea
                                    value={content.visualDiagnostics?.gallery1?.join('\n')}
                                    onChange={e => updateNestedContent('visualDiagnostics', ['gallery1'], e.target.value.split('\n').filter(s => s.trim()))}
                                    style={{ width: '100%', padding: '0.5rem' }} rows="5"
                                />
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label>Галерея 2 (URLs - по одному в строке):</label>
                                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                        + Загрузить файл в галерею 2
                                        <input type="file" hidden onChange={e => handleFileUpload(e, url => {
                                            const current = content.visualDiagnostics?.gallery2 || [];
                                            updateNestedContent('visualDiagnostics', ['gallery2'], [...current, url]);
                                        })} />
                                    </label>
                                </div>
                                {content.visualDiagnostics?.gallery2.length > 0 && content.visualDiagnostics?.gallery2.map((url, idx) => <img key={idx} src={url} alt="preview" style={{ height: '100px', objectFit: 'contain', marginTop: '0.5rem' }} />)}
                                <textarea
                                    value={content.visualDiagnostics?.gallery2?.join('\n')}
                                    onChange={e => updateNestedContent('visualDiagnostics', ['gallery2'], e.target.value.split('\n').filter(s => s.trim()))}
                                    style={{ width: '100%', padding: '0.5rem' }} rows="5"
                                />
                            </div>
                        </div>

                        {/* Smile Transformation */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Преображение улыбки</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('smileTransform')}>Сохранить</button>
                            </div>
                            <SmileTransformation data={content.smileTransform} />
                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                <label>Заголовок (Слева): <input type="text" value={content.smileTransform?.column1?.title} onChange={e => updateNestedContent('smileTransform', ['column1', 'title'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>Фото (Слева):</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {content.smileTransform?.column1?.image && <img src={content.smileTransform?.column1?.image} alt="preview" style={{ height: '100px', objectFit: 'contain', marginTop: '0.5rem' }} />}
                                        <input type="text" value={content.smileTransform?.column1?.image} readOnly style={{ flex: 1, padding: '0.5rem' }} />
                                        <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                            Добавить файл
                                            <input type="file" hidden onChange={e => handleFileUpload(e, url => updateNestedContent('smileTransform', ['column1', 'image'], url))} />
                                        </label>
                                    </div>
                                </div>

                                <label>Длительность: <input type="text" value={content.smileTransform?.column2?.block1?.value} onChange={e => updateNestedContent('smileTransform', ['column2', 'block1', 'value'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>Стоимость: <input type="text" value={content.smileTransform?.column2?.block2?.value} onChange={e => updateNestedContent('smileTransform', ['column2', 'block2', 'value'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>

                                <label>Врач: <input type="text" value={content.smileTransform?.column3?.name} onChange={e => updateNestedContent('smileTransform', ['column3', 'name'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>Стаж: <input type="text" value={content.smileTransform?.column3?.experience} onChange={e => updateNestedContent('smileTransform', ['column3', 'experience'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>Фото врача:</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {content.smileTransform?.column3?.image && <img src={content.smileTransform?.column3?.image} alt="preview" style={{ height: '100px', objectFit: 'contain', marginTop: '0.5rem' }} />}
                                        <input type="text" value={content.smileTransform?.column3?.image} readOnly style={{ flex: 1, padding: '0.5rem' }} />
                                        <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                            Добавить файл
                                            <input type="file" hidden onChange={e => handleFileUpload(e, url => updateNestedContent('smileTransform', ['column3', 'image'], url))} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Veneer Steps */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Этапы установки виниров</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('veneersSteps')}>Сохранить</button>
                            </div>
                            <label>Заголовок секции: <input type="text" value={content.veneersSteps?.title} onChange={e => updateNestedContent('veneersSteps', ['title'], e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '1.5rem' }} /></label>

                            {content.veneersSteps?.steps?.map((step, idx) => (
                                <div key={step.id} style={{ marginBottom: '2rem', padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
                                    <strong>Этап {idx + 1}</strong>
                                    <div style={{ display: 'grid', gap: '0.8rem', marginTop: '0.5rem' }}>
                                        <label>Заголовок: <input type="text" value={step.title} onChange={e => {
                                            const n = [...content.veneersSteps.steps];
                                            n[idx].title = e.target.value;
                                            updateNestedContent('veneersSteps', ['steps'], n);
                                        }} style={{ width: '100%', padding: '0.5rem' }} /></label>

                                        <label>Описание (оригинал): <textarea value={step.textOriginal} onChange={e => {
                                            const n = [...content.veneersSteps.steps];
                                            n[idx].textOriginal = e.target.value;
                                            updateNestedContent('veneersSteps', ['steps'], n);
                                        }} style={{ width: '100%', padding: '0.5rem' }} rows="3" /></label>

                                        <label>Описание (результат): <textarea value={step.textResult} onChange={e => {
                                            const n = [...content.veneersSteps.steps];
                                            n[idx].textResult = e.target.value;
                                            updateNestedContent('veneersSteps', ['steps'], n);
                                        }} style={{ width: '100%', padding: '0.5rem' }} rows="2" /></label>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label>Фото этапа:</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <input type="text" value={step.image?.preview || step.image || ''} readOnly style={{ flex: 1, padding: '0.5rem' }} placeholder="Путь к фото" />
                                                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                                    Добавить файл
                                                    <input type="file" hidden onChange={e => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const n = [...content.veneersSteps.steps];
                                                            n[idx].image = { file, preview: URL.createObjectURL(file) };
                                                            updateNestedContent('veneersSteps', ['steps'], n);
                                                        }
                                                    }} />
                                                </label>
                                            </div>
                                        </div>
                                        {step.image?.preview && <img src={step?.image?.preview} alt="preview" style={{ height: '100px', objectFit: 'contain', marginTop: '0.5rem' }} />}
                                        <button className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem', width: 'fit-content' }} onClick={() => removeItemFromArray('veneersSteps', ['steps'], idx)}>Удалить Этап</button>
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }} onClick={() => addItemToArray('veneersSteps', ['steps'], { id: Date.now(), title: '', textOriginal: '', textResult: '', image: '' })}>+ Добавить этап</button>
                        </div>

                        {/* Instagram Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Инстаграм</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('instagram')}>Сохранить</button>
                            </div>
                            {content.instagram?.image && <img src={content.instagram?.image} alt="preview" style={{ height: '200px', objectFit: 'contain', marginTop: '0.5rem' }} />}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>URL Фото (Instagram Overlay):</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="text" value={content.instagram?.image} readOnly style={{ flex: 1, padding: '0.5rem' }} />
                                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                        Добавить файл
                                        <input type="file" hidden onChange={e => handleFileUpload(e, url => updateNestedContent('instagram', ['image'], url))} />
                                    </label>
                                </div>
                                <label style={{ marginTop: '0.5rem' }}>Ссылка на Instagram:
                                    <input type="text" value={content.instagram?.link} onChange={e => updateNestedContent('instagram', ['link'], e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
                                </label>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Карта (Map)</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('map')}>Сохранить</button>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                <label>Iframe URL:
                                    <input type="text" value={content.map?.iframe} onChange={e => updateNestedContent('map', ['iframe'], e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }} />
                                </label>
                                <label>2GIS / Map Link:
                                    <input type="text" value={content.map?.link} onChange={e => updateNestedContent('map', ['link'], e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }} />
                                </label>
                            </div>
                        </div>

                        {/* Doctors Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Врачи (Doctors)</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('doctors')}>Сохранить</button>
                            </div>
                            {content.doctors?.map((doc, idx) => (
                                <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label>Имя: <input type="text" value={doc.name} onChange={e => {
                                            const n = [...content.doctors];
                                            n[idx].name = e.target.value;
                                            updateNestedContent('doctors', [], n);
                                        }} style={{ width: '100%', padding: '0.4rem' }} /></label>
                                        <label>Специальность: <input type="text" value={doc.specialty} onChange={e => {
                                            const n = [...content.doctors];
                                            n[idx].specialty = e.target.value;
                                            updateNestedContent('doctors', [], n);
                                        }} style={{ width: '100%', padding: '0.4rem' }} /></label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label>Фото врача:</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="text" value={doc.image} readOnly style={{ flex: 1, padding: '0.4rem' }} />
                                                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                                    Добавить файл
                                                    <input type="file" hidden onChange={e => handleFileUpload(e, url => {
                                                        const n = [...content.doctors];
                                                        n[idx].image = url;
                                                        updateNestedContent('doctors', [], n);
                                                    })} />
                                                </label>
                                            </div>
                                            {doc.image && <img src={doc.image} alt="preview" style={{ height: '100px', objectFit: 'contain', marginTop: '0.5rem' }} />}
                                        </div>
                                        <button className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => removeItemFromArray('doctors', [], idx)}>Удалить врача</button>
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-outline" onClick={() => addItemToArray('doctors', [], { name: '', specialty: '', image: '' })}>+ Добавить врача</button>
                        </div>

                        {/* Portfolio Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Портфолио (Portfolio)</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('portfolio')}>Сохранить</button>
                            </div>
                            {content.portfolio?.map((item, idx) => (
                                <>
                                    <div key={idx} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input type="text" value={item.image} readOnly style={{ flex: 1, padding: '0.4rem' }} placeholder="Фото" />
                                        <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                                            Добавить файл
                                            <input type="file" hidden onChange={e => handleFileUpload(e, url => {
                                                const n = [...content.portfolio];
                                                n[idx].image = url;
                                                updateNestedContent('portfolio', [], n);
                                            })} />
                                        </label>
                                        <button className="btn btn-danger btn-sm" onClick={() => removeItemFromArray('portfolio', [], idx)}>Удалить</button>
                                    </div>
                                    {item.image && <img src={item.image} alt="preview" style={{ height: '100px', objectFit: 'contain', marginTop: '0.5rem' }} />}
                                </>
                            ))}
                            <button className="btn btn-outline" onClick={() => addItemToArray('portfolio', [], { image: '' })}>+ Добавить фото</button>
                        </div>

                        {/* Price Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Цены (Price)</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('price')}>Сохранить</button>
                            </div>
                            {content.price?.map((item, idx) => (
                                <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label>Заголовок: <input type="text" value={item.title} onChange={e => {
                                            const n = [...content.price];
                                            n[idx].title = e.target.value;
                                            updateNestedContent('price', [], n);
                                        }} style={{ width: '100%', padding: '0.4rem' }} /></label>
                                        <label>Цена 1: <input type="text" value={item['text-price']} onChange={e => {
                                            const n = [...content.price];
                                            n[idx]['text-price'] = e.target.value;
                                            updateNestedContent('price', [], n);
                                        }} style={{ width: '100%', padding: '0.4rem' }} /></label>
                                        <label>Цена 2: <input type="text" value={item['text-price-2']} onChange={e => {
                                            const n = [...content.price];
                                            n[idx]['text-price-2'] = e.target.value;
                                            updateNestedContent('price', [], n);
                                        }} style={{ width: '100%', padding: '0.4rem' }} /></label>
                                        <button className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => removeItemFromArray('price', [], idx)}>Удалить категорию</button>
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-outline" onClick={() => addItemToArray('price', [], { title: '', 'text-price': '', 'text-price-2': '' })}>+ Добавить категорию цен</button>
                        </div>

                        {/* Contact Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Контакты (Contact)</h3>
                                <button className="btn btn-primary" onClick={() => saveSectionToServer('contact')}>Сохранить</button>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                <label>Адрес: <input type="text" value={content.contact?.address} onChange={e => updateNestedContent('contact', ['address'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>Телефон: <input type="text" value={content.contact?.phone} onChange={e => updateNestedContent('contact', ['phone'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>Email: <input type="text" value={content.contact?.email} onChange={e => updateNestedContent('contact', ['email'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>Режим работы: <input type="text" value={content.contact?.hours} onChange={e => updateNestedContent('contact', ['hours'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>VK URL: <input type="text" value={content.contact?.vk} onChange={e => updateNestedContent('contact', ['vk'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>TG URL: <input type="text" value={content.contact?.tg} onChange={e => updateNestedContent('contact', ['tg'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                                <label>WA URL: <input type="text" value={content.contact?.wa} onChange={e => updateNestedContent('contact', ['wa'], e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="admin-section">
                    <h2>Настройки</h2>
                    <div style={{ maxWidth: '400px', marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h3>Смена пароля</h3>
                        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Новый пароль:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Минимум 6 символов"
                                    style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Обновить пароль</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


