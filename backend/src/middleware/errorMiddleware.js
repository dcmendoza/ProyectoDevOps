export function notFound(_req, _res, next) {
  next({ status: 404, message: 'Ruta no encontrada' });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Error interno del servidor',
    errors: err.errors || undefined
  });
}
