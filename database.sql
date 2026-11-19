-- Jalankan melalui phpMyAdmin > Import, atau MySQL CLI.
-- Database dan tabel untuk REST API pengaduan mahasiswa.
CREATE DATABASE IF NOT EXISTS db_pengaduan_mahasiswa
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_pengaduan_mahasiswa;

CREATE TABLE IF NOT EXISTS pengaduan (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nama VARCHAR(120) NOT NULL,
  nim VARCHAR(30) NOT NULL,
  kategori VARCHAR(60) NOT NULL,
  judul VARCHAR(180) NOT NULL,
  isi TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Menunggu',
  tanggapan TEXT NULL,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_nim (nim),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data sengaja kosong. Tambahkan pengaduan melalui POST di Postman.
