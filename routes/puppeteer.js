import { Router } from 'express';
import puppeteerController from '../src/controllers/PuppeteerController';

const router = new Router();

router.post('/', puppeteerController.index);

export default router;
