import { rawNex } from "../db/dbUtil";
import { verify } from "./../token/accessToken";

export const get = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const payload = await verify(token);

    const response = await findAllCompanyBranchByIdCompany(payload.idCompany);
    res.statusCode = response.statusCode;
    res.json(response.data);
  } catch (err) {
    console.log(err);
  }
};

export const findAllCompanyBranchByIdCompany = async company => {
  let query = await rawNex(
    `SELECT * FROM company_branch WHERE company_id = ${company}`
  );

  if (query) {
    return {
      statusCode: 200,
      data: query
    };
  } else {
    return {
      statusCode: 500,
      data: {
        message: "Houve um erro"
      }
    };
  }
};

export default {
  get
};
