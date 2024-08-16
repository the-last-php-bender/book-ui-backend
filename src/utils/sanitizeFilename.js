export const sanitizeFilename = (filename) => {
    return filename.replace(/\s+/g, '_');
};
