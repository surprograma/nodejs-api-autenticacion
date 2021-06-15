import { index, show, create, login } from '../controllers/usuario_controller';
import { errorAwareRouter } from './utils';
import jwt from 'jsonwebtoken';

// TODO: mover esto a otro lugar
const SECRET = 'P1rul0!';

const router = errorAwareRouter();

const verificarAutenticacion = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send();
  }

  // TODO: hacer un parseo más seguro
  const accessToken = authHeader.split(' ')[1];

  if (!accessToken) {
    return res.status(401).send();
  }

  try {
    const payload = await jwt.verify(accessToken, SECRET);
    req.usuario = payload;
    next();
  } catch (e) {
    // TODO: ver de qué error se trata
    return res.status(401).json({ mensaje: 'Dormiste, tu token ya no sirve' });
  }
};

router.get('/', index, verificarAutenticacion);
router.get('/:id', show);
router.post('/', create);
router.post('/login', login);

export default router;
