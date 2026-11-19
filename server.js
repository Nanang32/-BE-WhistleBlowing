// Backend REST API berbasis Node.js + Express + MySQL (tanpa halaman web).
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { validateCreate, validatePatch, readPositiveId } = require('./validation');

const app = express();
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_pengaduan_mahasiswa',
  waitForConnections: true,
  connectionLimit: 5,
  charset: 'utf8mb4',
  dateStrings: true
});

app.use(cors({
  origin: [
    
    'http://localhost:3000/'
  ]
}));

app.disable('x-powered-by');
app.use(express.json({ limit: '25kb' }));

const FIELDS = 'id, nama, nim, kategori, judul, isi, status, tanggapan, dibuat_pada, diperbarui_pada';

// GET semua data; opsional filter ?nim=20260001
app.get('/api/pengaduan', async (req, res) => {
  const nim = req.query.nim;
  if (nim !== undefined && (typeof nim !== 'string' || !nim.trim() || nim.length > 30)) {
    return res.status(422).json({ success: false, message: 'Parameter nim tidak valid.' });
  }
  const sql = nim
    ? `SELECT ${FIELDS} FROM pengaduan WHERE nim = ? ORDER BY id DESC`
    : `SELECT ${FIELDS} FROM pengaduan ORDER BY id DESC`;
  const [rows] = await pool.execute(sql, nim ? [nim.trim()] : []);
  res.json({ success: true, total: rows.length, data: rows });
});

// GET detail berdasarkan ID
app.get('/api/pengaduan/:id', async (req, res) => {
  const id = readPositiveId(req.params.id);
  if (id === null) return res.status(422).json({ success: false, message: 'ID tidak valid.' });
  const [rows] = await pool.execute(`SELECT ${FIELDS} FROM pengaduan WHERE id = ?`, [id]);
  if (!rows.length) return res.status(404).json({ success: false, message: 'Pengaduan tidak ditemukan.' });
  res.json({ success: true, data: rows[0] });
});

// POST data dari Postman (Body -> raw -> JSON)
app.post('/api/pengaduan', async (req, res) => {
  const result = validateCreate(req.body);
  if (result.error) return res.status(422).json({ success: false, message: result.error });
  const { nama, nim, kategori, judul, isi } = result.data;
  const [insert] = await pool.execute(
    'INSERT INTO pengaduan (nama, nim, kategori, judul, isi) VALUES (?, ?, ?, ?, ?)',
    [nama, nim, kategori, judul, isi]
  );
  const [rows] = await pool.execute(`SELECT ${FIELDS} FROM pengaduan WHERE id = ?`, [insert.insertId]);
  res.status(201).json({ success: true, message: 'Pengaduan berhasil ditambahkan.', data: rows[0] });
});

// PATCH status dan/atau tanggapan
app.patch('/api/pengaduan/:id', async (req, res) => {
  const id = readPositiveId(req.params.id);
  if (id === null) return res.status(422).json({ success: false, message: 'ID tidak valid.' });
  const result = validatePatch(req.body);
  if (result.error) return res.status(422).json({ success: false, message: result.error });
  const columns = Object.keys(result.data);
  const values = columns.map((key) => result.data[key]);
  const sql = `UPDATE pengaduan SET ${columns.map((key) => `${key} = ?`).join(', ')} WHERE id = ?`;
  const [update] = await pool.execute(sql, [...values, id]);
  if (!update.affectedRows) return res.status(404).json({ success: false, message: 'Pengaduan tidak ditemukan.' });
  const [rows] = await pool.execute(`SELECT ${FIELDS} FROM pengaduan WHERE id = ?`, [id]);
  res.json({ success: true, message: 'Pengaduan berhasil diperbarui.', data: rows[0] });
});

// DELETE satu pengaduan
app.delete('/api/pengaduan/:id', async (req, res) => {
  const id = readPositiveId(req.params.id);
  if (id === null) return res.status(422).json({ success: false, message: 'ID tidak valid.' });
  const [result] = await pool.execute('DELETE FROM pengaduan WHERE id = ?', [id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Pengaduan tidak ditemukan.' });
  res.json({ success: true, message: 'Pengaduan berhasil dihapus.' });
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' }));
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Format JSON tidak valid.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Ukuran JSON terlalu besar.' });
  }
  console.error('API error:', err.message);
  res.status(500).json({ success: false, message: 'Kesalahan server. Periksa koneksi MySQL.' });
});

async function start() {
  const host = process.env.HOST || '127.0.0.1';
  const port = Number(process.env.PORT || 3000);
  try {
    await pool.query('SELECT 1');
    app.listen(port, host, () => {
      console.log(`REST API siap: http://${host}:${port}/api/pengaduan`);
      if (host === '0.0.0.0') console.log('Untuk HP, gunakan IP lokal komputer, bukan 0.0.0.0.');
    });
  } catch (err) {
    console.error('Gagal terhubung ke MySQL:', err.message);
    console.error('Periksa layanan MySQL, file .env, dan database.sql.');
    process.exitCode = 1;
    await pool.end();
  }
}

if (require.main === module) start();
module.exports = { app, pool };  // untuk pengujian unit, tidak menjalankan server otomatis
