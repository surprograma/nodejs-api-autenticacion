import { index, show, create, login } from '../controllers/usuario_controller';
import { errorAwareRouter, verificarAutenticacion } from './utils';

const router = errorAwareRouter();

router.get('/', index, verificarAutenticacion);
router.get('/:id', show);
router.post('/', create);
router.post('/login', login);

export default router;
