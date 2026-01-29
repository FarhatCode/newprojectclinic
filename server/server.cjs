const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join(__dirname, '../.env.development'))) {
    dotenv.config({ path: path.join(__dirname, '../.env.development') });
} else {
    dotenv.config();
}
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');
const upload = multer({ dest: path.join(__dirname, "../uploads/") });
const VITE_UPLOADS_URL = process.env.VITE_UPLOADS_URL;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Helper to read DB
const readDb = () => {
    if (!fs.existsSync(DB_FILE)) return { reviews: [], services: [], content: {} };
    const data = fs.readFileSync(DB_FILE);
    const db = JSON.parse(data);
    if (!db.content) db.content = {}; // Ensure content exists
    return db;
};

// Helper to write DB
const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        reviews: [
            { id: 1, author: 'Анна С.', text: 'Потрясающая клиника! Очень вежливый персонал и профессиональные врачи.', rating: 5, date: '2024-01-15' },
            { id: 2, author: 'Елена М.', text: 'Хожу сюда уже год, очень довольна качеством услуг.', rating: 5, date: '2024-02-20' }
        ],
        services: [
            { id: 1, title: 'Терапия', desc: 'Лечение кариеса и корневых каналов любой сложности.', icon: '🦷' }
        ],
        content: {}
    };
    writeDb(initialData);
}

// Routes
// GET Reviews
app.get('/api/reviews', (req, res) => {
    const db = readDb();
    res.json(db.reviews);
});

// POST Review
app.post('/api/reviews', (req, res) => {
    const db = readDb();
    const newReview = { id: Date.now(), ...req.body, date: new Date().toISOString().split('T')[0] };
    db.reviews.push(newReview);
    writeDb(db);
    res.status(201).json(newReview);
});

// GET Services
app.get('/api/services', (req, res) => {
    const db = readDb();
    res.json(db.services);
});

// POST Service
app.post('/api/services', (req, res) => {
    const db = readDb();
    const newService = { id: Date.now(), ...req.body };
    db.services.push(newService);
    writeDb(db);
    res.status(201).json(newService);
});

// PUT Service
app.put('/api/services/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.services.findIndex(s => s.id == id);
    if (index !== -1) {
        db.services[index] = { ...db.services[index], ...req.body };
        writeDb(db);
        res.json(db.services[index]);
    } else {
        res.status(404).json({ error: 'Service not found' });
    }
});

// DELETE Service
app.delete('/api/services/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.services = db.services.filter(s => s.id != id);
    writeDb(db);
    res.status(204).send();
});

// GET Appointments
app.get('/api/appointments', (req, res) => {
    const db = readDb();
    res.json(db.appointments || []);
});

// POST Appointment
app.post('/api/appointments', (req, res) => {
    const db = readDb();
    if (!db.appointments) db.appointments = [];
    const newAppointment = { id: Date.now(), ...req.body, date: new Date().toISOString() };
    db.appointments.push(newAppointment);
    writeDb(db);
    res.status(201).json(newAppointment);
});

// GET Content
app.get('/api/content', (req, res) => {
    const db = readDb();
    res.json(db.content || {});
});

// DELETE Review
app.delete('/api/reviews/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.reviews = db.reviews.filter(r => r.id != id);
    writeDb(db);
    res.status(204).send();
});

// PUT Review
app.put('/api/reviews/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const index = db.reviews.findIndex(r => r.id == id);
    if (index !== -1) {
        db.reviews[index] = { ...db.reviews[index], ...req.body };
        writeDb(db);
        res.json(db.reviews[index]);
    } else {
        res.status(404).json({ error: 'Review not found' });
    }
});

// POST Content (update whole content or specific section)
app.post('/api/content', upload.any(), (req, res) => {
    const db = readDb();
    const { section, data } = req.body;

    if (section === "veneersSteps") {
        let steps = [];
        try {
            steps = JSON.parse(req.body.steps || "[]");
        } catch (e) {
            console.error("Ошибка парсинга steps:", e);
        }

        // прикрепляем файлы по имени поля
        req.files.forEach((file) => {
            const match = file.fieldname.match(/^file_(\d+)$/);
            if (match) {
                const idx = parseInt(match[1], 10);
                if (steps[idx]) {
                    steps[idx].image = {
                        file: {},
                        preview: `${VITE_UPLOADS_URL}/uploads/${file.filename}`
                    };
                }
            }
        });

        db.content[section] = {
            title: req.body.title || db.content[section]?.title || "",
            steps
        };
    } else {
        if (section) {
            db.content[section] = data;
        } else {
            db.content = { ...db.content, ...req.body };
        }
    }

    writeDb(db);
    res.json(db.content);
});


// File Upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    res.json({ url: `${VITE_UPLOADS_URL}/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT`);
});
