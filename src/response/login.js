import { rawNex } from "./../db/dbUtil";
import { sign } from "./../token/accessToken";
// import env from "@/config/env";

export const get = async (req, res) => {
  const { username, password } = req.body;

  let result;
  //   if (env.NODE_ENV === "development") {
  //     result = await login("12345678910", "im2018staging");
  //   } else {
  result = await login(username, password);
  //   }

  res.statusCode = result.statusCode;
  res.json(result.data);
};

export const login = async (username, password) => {
  const company = await rawNex(
    `SELECT * FROM company WHERE login = ${username} AND password = ${password}`
  );
  if (company.length > 0) {
    return {
      statusCode: 200,
      data: {
        idCompany: company[0].id,
        brand: company[0].brand,
        cnpj: company[0].cnpj,
        token: sign({
          idCompany: company[0].id
        })
      }
    };
  }
  return {
    statusCode: 401,
    data: {
      message: "Usuário ou senha incorreto"
    }
  };
};

export default { get };
