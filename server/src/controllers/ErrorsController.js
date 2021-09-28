export function notFound(request, response) {
    return response.status(404).json({ error: 'Not Found' });
}

export function error(error, request, response, next) {
    return response.status(error.status || 500).json({ error: "Ocorreu um problema ao realizar esta operação. Tente novamente mais tarde" });
}