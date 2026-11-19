// Aturan validasi sederhana untuk praktikum lokal.
const FIELDS = {
  nama: 120,
  nim: 30,
  kategori: 60,
  judul: 180,
  isi: 5000
};
const STATUS = ['Menunggu', 'Diproses', 'Selesai'];

function isJsonObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function checkString(name, value, max) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return `${name} wajib berupa teks yang tidak kosong.`;
  }
  if (value.trim().length > max) {
    return `${name} maksimal ${max} karakter.`;
  }
  return null;
}

function validateCreate(body) {
  if (!isJsonObject(body)) return { error: 'Body harus berupa objek JSON.' };
  for (const [name, max] of Object.entries(FIELDS)) {
    const error = checkString(name, body[name], max);
    if (error) return { error };
  }
  return {
    data: Object.fromEntries(Object.keys(FIELDS).map((k) => [k, body[k].trim()]))
  };
}

function validatePatch(body) {
  if (!isJsonObject(body)) return { error: 'Body harus berupa objek JSON.' };
  const names = Object.keys(body);
  if (!names.length || names.some((name) => !['status', 'tanggapan'].includes(name))) {
    return { error: 'Isi hanya status dan/atau tanggapan.' };
  }
  const data = {};
  if (Object.hasOwn(body, 'status')) {
    if (!STATUS.includes(body.status)) {
      return { error: 'Status harus Menunggu, Diproses, atau Selesai.' };
    }
    data.status = body.status;
  }
  if (Object.hasOwn(body, 'tanggapan')) {
    if (body.tanggapan !== null && (typeof body.tanggapan !== 'string' || body.tanggapan.length > 5000)) {
      return { error: 'Tanggapan harus berupa teks maksimal 5000 karakter atau null.' };
    }
    data.tanggapan = body.tanggapan === null ? null : body.tanggapan.trim();
  }
  return { data };
}

function readPositiveId(raw) {
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) ? id : null;
}

module.exports = { validateCreate, validatePatch, readPositiveId };
