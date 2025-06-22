const express = require('express');
const cors = require('cors');
const db = require('./db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../frontend/public/images'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));


// Optional: serve images from backend
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// GET all products with category
app.get('/products', (req, res) => {
  const sql = `
    SELECT p.id, p.name, p.image, p.price, c.name AS category, p.stock, p.description, p.category_id
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//ADD PRODUCT
app.post('/products', upload.single('image'), (req, res) => {
  const { name, category_id, price, stock, description } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;


  const sql = `
    INSERT INTO products (name, image, category_id, price, stock, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, image, category_id, price, stock, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      id: result.insertId,
      name,
      image,
      category_id,
      price,
      stock,
      description
    });
  });
});

// UPDATE Product
app.put('/products/:id', upload.single('image'), (req, res) => {
  const { name, category_id, price, stock, description } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;
  const { id } = req.params;

  let sql = `
    UPDATE products SET name=?, category_id=?, price=?, stock=?, description=?
  `;
  const params = [name, category_id, price, stock, description];

  if (image) {
    sql += `, image=?`;
    params.push(image);
  }

  sql += ` WHERE id=?`;
  params.push(id);

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// DELETE PRODUCT
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

// GET all categories
app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
