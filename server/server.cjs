const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
const UPLOADS_DIR = path.join(__dirname, "../uploads/");
const upload = multer({ dest: UPLOADS_DIR });
const VITE_UPLOADS_URL = process.env.VITE_UPLOADS_URL;
const VITE_API_URL = process.env.VITE_API_URL;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD;
if (!DEFAULT_PASSWORD) {
    console.error("CRITICAL ERROR: ADMIN_PASSWORD is not defined in .env! Server will not allow login.");
}

// Native Node.js Password Hashing (compatible with web and local)
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
    if (!storedHash.includes(':')) {
        // Migration: If plain text, check and then hash
        return password === storedHash;
    }
    const [salt, hash] = storedHash.split(':');
    const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return hash === checkHash;
};

const getAdminPasswordHash = () => {
    const db = readDb();
    let stored = db.settings?.password;
    if (!stored) {
        // Store default hashed if nothing exists
        stored = hashPassword(DEFAULT_PASSWORD);
        if (!db.settings) db.settings = {};
        db.settings.password = stored;
        writeDb(db);
    }
    return stored;
};

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // For simplicity with the existing Bearer token logic, we still use the plain password
    // In a real app we'd use JWT, but here we'll re-verify the "token" which is the plain pass
    const providedPassword = (authHeader || '').replace('Bearer ', '');
    if (providedPassword && verifyPassword(providedPassword, getAdminPasswordHash())) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password && verifyPassword(password, getAdminPasswordHash())) {
        res.json({ success: true, token: password });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

app.post('/api/change-password', authMiddleware, (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password too short' });
    }
    const db = readDb();
    if (!db.settings) db.settings = {};
    db.settings.password = hashPassword(newPassword);
    writeDb(db);
    res.json({ success: true });
});

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

const collectUploadUrlsDeep = (value, accumulator = new Set()) => {
    if (value === null || value === undefined) return accumulator;

    if (typeof value === 'string') {
        if (value.includes('/uploads/')) accumulator.add(value);
        return accumulator;
    }

    if (Array.isArray(value)) {
        value.forEach((item) => collectUploadUrlsDeep(item, accumulator));
        return accumulator;
    }

    if (typeof value === 'object') {
        Object.values(value).forEach((item) => collectUploadUrlsDeep(item, accumulator));
    }

    return accumulator;
};

const getUploadFilenameFromUrl = (urlValue) => {
    if (!urlValue || typeof urlValue !== 'string') return null;
    const marker = '/uploads/';
    const markerIndex = urlValue.indexOf(marker);
    if (markerIndex === -1) return null;

    const tail = urlValue.slice(markerIndex + marker.length);
    const cleanTail = tail.split('?')[0].split('#')[0].trim();
    if (!cleanTail) return null;

    const filename = path.basename(cleanTail);
    if (!filename || filename.includes('..') || filename !== cleanTail) return null;
    return filename;
};

const deleteUploadByUrl = (urlValue) => {
    const filename = getUploadFilenameFromUrl(urlValue);
    if (!filename) return;

    const filePath = path.join(UPLOADS_DIR, filename);
    if (!filePath.startsWith(path.resolve(UPLOADS_DIR))) return;

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Failed to delete upload file "${filePath}":`, error);
        }
    }
};

const deleteUnusedUploads = (oldUrlsSet, dbAfterUpdate) => {
    if (!oldUrlsSet || oldUrlsSet.size === 0) return;
    const usedAfterUpdate = collectUploadUrlsDeep(dbAfterUpdate, new Set());

    oldUrlsSet.forEach((oldUrl) => {
        if (!usedAfterUpdate.has(oldUrl)) {
            deleteUploadByUrl(oldUrl);
        }
    });
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

// POST Service (Protected)
app.post('/api/services', authMiddleware, (req, res) => {
    const db = readDb();
    const newService = { id: Date.now(), ...req.body };
    db.services.push(newService);
    writeDb(db);
    res.status(201).json(newService);
});

// PUT Service (Protected)
app.put('/api/services/:id', authMiddleware, (req, res) => {
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

// DELETE Service (Protected)
app.delete('/api/services/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const serviceToDelete = db.services.find((s) => s.id == id);
    db.services = db.services.filter((s) => s.id != id);
    writeDb(db);

    if (serviceToDelete?.icon) {
        const iconRefs = new Set([serviceToDelete.icon]);
        deleteUnusedUploads(iconRefs, db);
    }

    res.status(204).send();
});

// GET Appointments (Protected)
app.get('/api/appointments', authMiddleware, (req, res) => {
    const db = readDb();
    res.json(db.appointments || []);
});

// POST Appointment
app.post('/api/appointments', (req, res) => {
    const db = readDb();
    if (!db.appointments) db.appointments = [];
    const newAppointment = {
        id: Date.now(),
        ...req.body,
        status: 'new', // Default status
        date: new Date().toISOString()
    };
    db.appointments.push(newAppointment);
    writeDb(db);
    res.status(201).json(newAppointment);
});

// Update Appointment Status (Protected)
app.put('/api/appointments/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const { status } = req.body;
    const index = db.appointments.findIndex(a => a.id == Number(id));
    if (index !== -1) {
        db.appointments[index].status = status;
        writeDb(db);
        res.json(db.appointments[index]);
    } else {
        res.status(404).json({ error: 'Appointment not found' });
    }
});

// DELETE Appointment (Protected)
app.delete('/api/appointments/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.appointments = db.appointments.filter(a => a.id != Number(id));
    writeDb(db);
    res.status(204).send();
});

// GET Content
app.get('/api/content', (req, res) => {
    const db = readDb();
    res.json(db.content || {});
});

// DELETE Review (Protected)
app.delete('/api/reviews/:id', authMiddleware, (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.reviews = db.reviews.filter(r => r.id != id);
    writeDb(db);
    res.status(204).send();
});

// PUT Review (Protected)
app.put('/api/reviews/:id', authMiddleware, (req, res) => {
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

// POST Content (Protected)
app.post('/api/content', authMiddleware, upload.any(), (req, res) => {
    const db = readDb();
    const { section, data } = req.body;
    const oldSectionUploadUrls = section ? collectUploadUrlsDeep(db.content?.[section], new Set()) : new Set();

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
    if (section) {
        deleteUnusedUploads(oldSectionUploadUrls, db);
    }
    res.json(db.content);
});


// File Upload (Protected)
app.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    res.json({ url: `${VITE_UPLOADS_URL}/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${VITE_API_URL}`);
});
