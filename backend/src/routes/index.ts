import { Router } from 'express';
import { filmeRoutes } from './filmeRoutes';

const router = Router();

router.use('/filmes', filmeRoutes);

export { router as appRoutes };