export const createURL = (protocol: string, host: string, port?: number) => {
    const url = `${protocol}://${host}`;
    
    if (port) {
        return `${url}:${port}`;
    }

    return url;
}