const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3307,                  
  user: 'root',
  password: '',
  database: 'product_manager'   
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek DB:', err);
    return;
  }
  console.log('✅ Koneksi ke MySQL berhasil');
});

module.exports = db;
