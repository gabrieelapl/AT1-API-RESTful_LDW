import { Router } from 'express';
import { FilmeController } from '../controllers/FilmeController';

const router = Router();

router.get('/', FilmeController.index);
router.get('/:id', FilmeController.show);
router.post('/', FilmeController.create);
router.put('/:id', FilmeController.update);
router.delete('/:id', FilmeController.delete);

export { router as filmeRoutes };