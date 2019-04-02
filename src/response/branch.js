import { rawNex } from "./../db/dbUtil";
import { add } from "./responseUtil";

export const totalBranchRevenues = async (req, res) => {
  try {
    const { request_branch } = req.params;
    let data = await rawNex(
      `SELECT flow, dt_h, product_id, price FROM flow join faucet ON (flow.faucet_id = faucet.id) join product ON (product.id = faucet.product_id) WHERE faucet.branch_id = ${request_branch}`
    );

    data = JSON.stringify(data);
    data = JSON.parse(data);

    let liters = [];
    let answer = [];
    let revenues = [];

    for(let i = 1; i < data.length ;i++){

  let dt = parseFloat(data[i].dt_h);
  let avgflow = (parseFloat(data[i].flow) + parseFloat(data[i-1].flow))/2;
  liters.push(avgflow*dt);
  revenues.push(avgflow*dt*data[i].price)

  let element = {
    litros: liters.reduce(add),
    faturamento: revenues.push(add),
  }
  answer.push (element);

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
