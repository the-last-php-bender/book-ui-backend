export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
};
