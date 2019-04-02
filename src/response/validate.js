import { verify } from "../token/accessToken";

export const get = async (req, res) => {
  try {

    await verify(req.headers["x-access-token"]);
    console.log(res)

    res.statusCode = 200;
    res.json({
      message: "Good to go!"
    });
  } catch (err) {
    res.statusCode = 401;
    res.json({
      message: "Token inválido"
    });
  }
};

export default {
  get
};
