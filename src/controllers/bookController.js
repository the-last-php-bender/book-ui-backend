import fs from 'fs';
import path from 'path';
import { sanitizeFilename } from '../utils/sanitizeFilename.js';
import { ebookDir } from '../config/paths.js';

export const listBooks = (req, res, next) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    const sanitizedSearch = sanitizeFilename(search);
    const offset = (page - 1) * limit;
    const bookFiles = fs.readdirSync(ebookDir);

    const filteredFiles = bookFiles.filter(file => file.includes(sanitizedSearch));
    const paginatedFiles = filteredFiles.slice(offset, offset + limit);

    res.status(200).setHeader('Content-Type', 'application/json').json({
        books: paginatedFiles.map(file => sanitizeFilename(file)),
        totalBooks: filteredFiles.length,
        currentPage: Number(page),
        totalPages: Math.ceil(filteredFiles.length / limit)
    });
};

export const downloadBook = (req, res, next) => {
    const filename = sanitizeFilename(decodeURIComponent(req.params.filename));
    const filePath = path.join(ebookDir, filename);

    if (fs.existsSync(filePath)) {
        const onClose = () => {
            console.log('Download request was aborted');
        };

        res.on('close', onClose);

        res.download(filePath, filename, (err) => {
            if (err && err.code !== 'ECONNABORTED') {
                console.error('Error downloading file:', err);
                return res.status(500).setHeader('Content-Type', 'application/json').json({ error: 'Failed to download file' });
            }
        });

        res.on('finish', () => {
            res.removeListener('close', onClose);
        });

    } else {
        res.status(404).setHeader('Content-Type', 'application/json').json({ message: 'Book not found' });
    }
};
