import { Router } from 'express';
import homeController from '../src/controllers/HomeController';

const router = new Router();

router.get('/', homeController.index);

export default router;
