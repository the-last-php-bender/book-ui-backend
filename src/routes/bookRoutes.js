import express from 'express';
import { listBooks, downloadBook } from '../controllers/bookController.js';

const router = express.Router();

router.get('/books', listBooks);
router.get('/books/:filename', downloadBook);

export default router;
