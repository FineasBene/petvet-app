function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 'P2025') return res.status(404).json({ error: 'Resursa nu a fost găsită' });
  if (err.code === 'P2002') return res.status(409).json({ error: 'Valoare duplicată: ' + err.meta?.target });
  res.status(500).json({ error: err.message || 'Eroare internă de server' });
}

module.exports = errorHandler;
