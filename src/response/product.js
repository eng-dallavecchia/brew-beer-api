import { rawNex } from "./../db/dbUtil";
import { add } from "./responseUtil";

export const revenuesByProduct = async (req, res) => {
  try {
    const { request_branch } = req.params;
    const { request_product } = req.params;

    let data = await rawNex(
      `SELECT flow.flow, flow.dt_h, product.price, product.name AS pName FROM faucet join flow ON (faucet.sensor = flow.sensor_code) join product ON (product.id = product_id) WHERE product.id = ${request_product} AND faucet.branch_id = ${request_branch}`
    );

    let liters = [];
    let revenues = [];

    for (let i = 0; i < data.length; i++) {
      let dt = parseFloat(data[i].dt_h);
      let avgflow = parseFloat(data[i].flow);

      liters.push(avgflow * dt);
      revenues.push(avgflow * dt * parseFloat(data[i].price));
    }

    let answer = {
      litros: liters.reduce(add, 0),
      faturamento: revenues.reduce(add, 0),
    };
    return {
      statusCode: 200,
      data: { answer },
      message: "Success!"
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      statusCode: 500,
      data: {
        message: "Houve um erro!"
      }
    };
  }
};

export const revenuesByProductType = async (req, res) => {
  try {
    const { request_branch } = req.params;
    const { request_product_type } = req.params;

    let data = await rawNex(
      `SELECT flow, dt_h, price FROM faucet join flow ON (faucet.sensor = flow.sensor_code) join product ON (product.id = product_id) WHERE product_type_id = ${request_product_type} AND faucet.branch_id = ${request_branch}`
    );

    let liters = [0];
    let revenues = [0];

    for (let i = 1; i < data.length; i++) {
      let dt = parseFloat(data[i].dt_h);
      let avgflow = parseFloat(data[i].flow);

      liters.push(avgflow * dt);
      revenues.push(avgflow * dt * parseFloat(data[i].price));
    }

    let answer = {
      litros: liters.reduce(add),
      faturamento: revenues.reduce(add)
    };
    return {
      statusCode: 200,
      data: { answer },
      message: "Success!"
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      statusCode: 500,
      data: {
        message: "Houve um erro!"
      }
    };
  }
};
