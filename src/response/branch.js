import { rawNex } from "./../db/dbUtil";
import { add } from "./responseUtil";
import moment from "moment";

export const branchRevenuesThisMonth = async (req, res) => {
  try {
    const { request_branch } = req.params;
    let data = await rawNex(
      `
          SELECT flow, 
            dt_h, 
            product_id, 
            price, 
            flow.date_creation AS f_date
      FROM   flow 
            JOIN faucet 
              ON ( flow.faucet_id = faucet.id ) 
            JOIN product 
              ON ( product.id = faucet.product_id ) 
      WHERE  faucet.branch_id = ${request_branch}
            AND Month(flow.date_creation) = Month( 
                Convert_tz(Now(), "+00:00", "-03:00")) 
            AND flow.flow != 0 `
    );

    let liters = [0];
    let revenues = [0];
    let answer = [];

    for (let i = 0; i < data.length; i++) {
      let dt = parseFloat(data[i].dt_h);
      let avgflow = parseFloat(data[i].flow);

      liters.push(avgflow * dt);
      revenues.push(avgflow * dt * parseFloat(data[i].price));

      let element = {
        litros: liters.reduce(add),
        faturamento: revenues.reduce(add),
        creation: moment(data[i].f_date).format()
      };

      answer.push(element);
    }
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

export const branchRevenuesThisDay = async (req, res) => {
  try {
    const { request_branch } = req.params;
    let data = await rawNex(
      `SELECT flow, 
          dt_h, 
          product_id, 
          price, 
          flow.date_creation 
    FROM   flow 
          JOIN faucet 
            ON ( flow.faucet_id = faucet.id ) 
          JOIN product 
            ON ( product.id = faucet.product_id ) 
    WHERE  faucet.branch_id = ${request_branch}
          AND Day(flow.date_creation) = Day(Convert_tz(Now(), "+00:00", "-03:00")) 
          AND flow.flow != 0 `
    );

    let liters = [0];
    let revenues = [0];
    let answer = [];

    for (let i = 0; i < data.length; i++) {
      let dt = parseFloat(data[i].dt_h);
      let avgflow = parseFloat(data[i].flow);

      liters.push(avgflow * dt);
      revenues.push(avgflow * dt * parseFloat(data[i].price));

      let element = {
        litros: liters.reduce(add),
        faturamento: revenues.reduce(add)
      };

      answer.push(element);
    }
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

export const branchFaucets = async (req, res) => {
  try {
    const { request_branch } = req.params;
    let data = await rawNex(
      `SELECT faucet.id as id, sensor, faucet_name, product_id, product.name as product_name from faucet join product ON (product.id =faucet.product_id) WHERE activity = 1 AND faucet.branch_id = ${request_branch}`
    );

    let answer = [];

    for (let i = 0; i < data.length; i++) {
      let element = {
        torneira_id: data[i].id,
        sensor: data[i].sensor,
        nome: data[i].faucet_name,
        produto: data[i].product_name,
        produto_id: data[i].product_id
      };

      answer.push(element);
    }
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

export const branchProducts = async (req, res) => {
  try {
    const { request_branch } = req.params;
    let data = await rawNex(
      `SELECT DISTINCT product.id as p_id, product.name as p_name, price as p_price, product_type_id as p_type FROM product join faucet ON (product.id = faucet.product_id) WHERE faucet.branch_id = ${request_branch}`
    );

    let answer = [];

    for (let i = 0; i < data.length; i++) {
      let element = {
        produto_id: data[i].p_id,
        nome: data[i].p_name,
        preco: data[i].p_price,
        tipo: data[i].p_type
      };
      answer.push(element);
    }
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

export const branchProductTypes = async (req, res) => {
  try {
    const { request_branch } = req.params;
    let data = await rawNex(
      `SELECT DISTINCT product_type.id as pt_id, product_type.name as pt_name FROM product join faucet ON (product.id = faucet.product_id) join product_type ON (product_type_id = product_type.id) WHERE faucet.branch_id = ${request_branch}`
    );

    let answer = [];

    for (let i = 0; i < data.length; i++) {
      let element = {
        produto_id: data[i].pt_id,
        nome: data[i].pt_name
      };
      answer.push(element);
    }
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
