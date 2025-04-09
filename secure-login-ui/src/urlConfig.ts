export const api: string = 'http://localhost:8080/api';

export const generatePublicUrls = (filename: string): string => {
    return `http://localhost:8080/public/${filename}`;
}