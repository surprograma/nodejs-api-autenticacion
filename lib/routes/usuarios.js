import { index, show, create } from '../controllers/usuario_controller';
import { errorAwareRouter } from './utils';

const router = errorAwareRouter();

router.get('/', index);
router.get('/:id', show);
router.post('/', create);

export default router;
