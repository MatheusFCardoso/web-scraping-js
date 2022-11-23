import { Router } from 'express';
import noticiaController from '../src/controllers/NoticiaController';

const router = new Router();

router.get('/', noticiaController.index);

export default router;
