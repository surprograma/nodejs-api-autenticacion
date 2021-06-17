import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const withErrorHandling = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export function errorAwareRouter() {
  const basicRouter = express.Router();
  function newRouter(...params) {
    basicRouter(...params);
  }
  newRouter.get = function (path, controller, middleware) {
    // TODO: mejorar esto para que pueda recibir infinitos middlewares
    if (middleware) {
      basicRouter.get(path, middleware, withErrorHandling(controller));
    } else {
      basicRouter.get(path, withErrorHandling(controller));
    }
  };
  newRouter.post = function (path, controller) {
    basicRouter.post(path, withErrorHandling(controller));
  };
  newRouter.patch = function (path, controller) {
    basicRouter.patch(path, withErrorHandling(controller));
  };
  newRouter.delete = function (path, controller) {
    basicRouter.delete(path, withErrorHandling(controller));
  };
  newRouter.put = function (path, controller) {
    basicRouter.put(path, withErrorHandling(controller));
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
