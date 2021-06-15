import { index, show, create, login } from '../controllers/usuario_controller';
import { errorAwareRouter } from './utils';

const router = errorAwareRouter();

router.get('/', index);
router.get('/:id', show);
router.post('/', create);
router.post('/login', login);

export default router;
