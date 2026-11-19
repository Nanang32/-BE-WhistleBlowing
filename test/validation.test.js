const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateCreate, validatePatch, readPositiveId } = require('../validation');

const record = { nama:'Andi Saputra', nim:'20260001', kategori:'Fasilitas', judul:'AC rusak', isi:'AC tidak dingin.' };

test('pengaduan lengkap diterima', () => {
  assert.deepEqual(validateCreate(record).data, record);
});
test('nim kosong ditolak', () => {
  assert.match(validateCreate({ ...record, nim:' ' }).error, /nim wajib/);
});
test('status hanya pilihan yang disepakati', () => {
  assert.equal(validatePatch({ status:'Diproses' }).data.status, 'Diproses');
  assert.match(validatePatch({ status:'Tidak dikenal' }).error, /Status harus/);
});
test('patch tidak boleh mengubah nama', () => {
  assert.match(validatePatch({ nama:'Orang lain' }).error, /hanya status/);
});
test('ID harus bilangan bulat positif aman', () => {
  assert.equal(readPositiveId('1'), 1);
  assert.equal(readPositiveId('-1'), null);
  assert.equal(readPositiveId('1a'), null);
});
