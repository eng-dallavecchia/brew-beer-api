import jwt from "jsonwebtoken";
import env from "./../config/env";

export const sign = payload => {
  return jwt.sign(payload, env.LOGIN_TOKEN_SECRET, {
    expiresIn: "7d"
  });
};

export const verify = async token => {
  return await jwt.verify(token, env.LOGIN_TOKEN_SECRET);
};

export const refreshToken = token => {
  const payload = verify(token);
  if (payload) {
    return jwt.sign(payload, env.LOGIN_TOKEN_SECRET, {
      expiresIn: "7d"   
    });
  }
};