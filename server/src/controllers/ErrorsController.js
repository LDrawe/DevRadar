export const notFound = (request, response) => response.status(404).json({ error: 'Not Found' });

export const error = (error, request, response, next) =>
    response.status(error.status || 500).json({ error: error.message || "Ocorreu um problema ao realizar esta operação. Tente novamente mais tarde" });