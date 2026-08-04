const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// "Databases"
let users = [
  { id: 1, name: 'Admin', email: 'admin@ktronic.org', password: 'admin', role: 'admin' }
];
let products = [];

// --- AUTHENTICATION ROUTES ---
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const newUser = { id: Date.now(), name, email, password, role: 'user' };
  users.push(newUser);
  res.json({ message: 'Signup successful', role: newUser.role, name: newUser.name });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ message: 'Login successful', role: user.role, name: user.name });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// --- PRODUCT ROUTES ---
app.post('/api/products', upload.single('image'), (req, res) => {
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    description: req.body.description,
    image: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null,
  };
  products.push(newProduct);
  res.json({ message: 'Product saved!', product: newProduct });
});

app.get('/api/products', (req, res) => res.json(products));

const PORT = 5000;
app.listen(PORT, () => console.log(`Ktronic Backend running on http://localhost:${PORT}`));