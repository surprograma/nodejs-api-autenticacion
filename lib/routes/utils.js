import express from 'express';
import jwt from 'jsonwebtoken';
import { init, last } from 'ramda';
import { JWT_SECRET } from '../config';

export const withErrorHandling = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export function errorAwareRouter() {
  const basicRouter = express.Router();
  function newRouter(...params) {
    basicRouter(...params);
  }
  newRouter.get = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.get(path, ...middlewares, withErrorHandling(controller));
  };
  newRouter.post = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.post(path, ...middlewares, withErrorHandling(controller));
  };
  newRouter.patch = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.patch(path, ...middlewares, withErrorHandling(controller));
  };
  newRouter.delete = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.delete(path, ...middlewares, withErrorHandling(controller));
  };
  newRouter.put = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.put(path, ...middlewares, withErrorHandling(controller));
  };
  return newRouter;
}

const parseAuthHeader = (header) => {
  const matches = header?.match(/Bearer (.+)/);
  return matches?.[1]; // Si la regexp funcionó, el token es el segundo elemento del array
};

export async function verificarAutenticacion(req, res, next) {
  const accessToken = parseAuthHeader(req.headers.authorization);

  if (!accessToken) {
    return res.status(401).send();
  }

  try {
    const payload = await jwt.verify(accessToken, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (e) {
    // TODO: ver de qué error se trata
    return res.status(401).json({ mensaje: 'Dormiste, tu token ya no sirve' });
  }
}
