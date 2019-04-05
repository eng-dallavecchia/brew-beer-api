import { rawNex } from "./../db/dbUtil";
import { add } from "./responseUtil";


export const flowByFaucetReport = async (req, res) => {
  try {
    const { request_sensor } = req.params;
    let res_ = await rawNex(
      `SELECT flow, faucet_name FROM flow join faucet ON (sensor_code = sensor) WHERE sensor = ${request_sensor}`
    );

    return {
      statusCode: 200,
      data: {
        res_,
        message: "Success!"
      }
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

export const faucetReport = async (req, res) => {
  try {
    const { request_branch } = req.params;
    const { request_faucet} = req.params;

    let data = await rawNex(
      `SELECT faucet.id, sensor, faucet_name, flow, dt_h, flow.date_creation as date_flow, product_id, price FROM faucet join flow ON (faucet.sensor = flow.sensor_code) join product ON (product.id = product_id) WHERE activity = 1 AND faucet.id = ${request_faucet} AND faucet.branch_id = ${request_branch}`
    );

    let liters = [0];
    let revenues = [0];
    let answer = [];


    for(let i = 0; i < data.length ;i++){

  let dt = parseFloat(data[i].dt_h);
  let avgflow = parseFloat(data[i].flow);

  liters.push(avgflow*dt);
  revenues.push(avgflow*dt*parseFloat(data[i].price));

  let element = {
    id: data[i].id,
    nome: data[i].faucet_name,
    sensor: data[i].sensor,
    fluxo: data[i].flow,
    data: data[i].date_flow,
    litros: liters.reduce(add),
    faturamento: revenues.reduce(add),
  }

  answer.push(element);

}
    return {
      statusCode: 200,
      data: {answer},
        message: "Success!"
      }
    }
    catch (error) {
    console.log("Error: ", error);
    return {
      statusCode: 500,
      data: {
        message: "Houve um erro!"
      }
    };
  }
};
