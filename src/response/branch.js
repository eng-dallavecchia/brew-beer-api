import { rawNex, rawOne } from "./../db/dbUtil";

export const branchRevenuesThisMonth = async (req, res) => {

  try {
    const { request_branch } = req.params;
    let data = await rawOne(
      `SELECT
        FORMAT(SUM(flow*dt_h),2) litros,
        FORMAT(SUM(flow*dt_h*price),2) faturamento,
          MONTH(flow.date_creation) as mês
    FROM   flow
          JOIN faucet
            ON ( flow.faucet_id = faucet.id )
          JOIN product
            ON ( product.id = faucet.product_id )
    WHERE  faucet.branch_id = ${request_branch}
          AND MONTH(flow.date_creation) = MONTH(Convert_tz(Now(), "+00:00", "-03:00"))
          AND flow.flow != 0`
    );

    return {
      statusCode: 200,
      data: { data },
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
    let data = await rawOne(
      `SELECT
        FORMAT(SUM(flow*dt_h),2) litros,
        FORMAT(SUM(flow*dt_h*price),2) faturamento,
        DAY(flow.date_creation) as dia
    FROM   flow
          JOIN faucet
            ON ( flow.faucet_id = faucet.id )
          JOIN product
            ON ( product.id = faucet.product_id )
    WHERE  faucet.branch_id = ${request_branch}
          AND Day(flow.date_creation) = Day(Convert_tz(Now(), "+00:00", "-03:00"))
          AND flow.flow != 0`
    );

    return {
      statusCode: 200,
      data: { data },
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

export const graphMonth = async (req, res) => {
  try {
    const { request_branch } = req.params;
    let data = await rawNex(
      `SELECT
	     DAY(flow.date_creation) dia,
        FORMAT(SUM(flow*dt_h),2) litros,
        FORMAT(SUM(flow*dt_h*price),2) faturamento
    FROM   flow
          JOIN faucet
            ON ( flow.faucet_id = faucet.id )
          JOIN product
            ON ( product.id = faucet.product_id )
    WHERE  faucet.branch_id = ${request_branch}
          AND month(flow.date_creation) = month(Convert_tz(Now(), "+00:00", "-03:00"))
          AND flow.flow != 0

          GROUP BY (DAY(flow.date_creation))`
    );

    return {
      statusCode: 200,
      data: { data },
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

export const barrelControl = async (req, res) => {

  try {
    const { request_branch } = req.params;
    let data = await rawNex(
      `SELECT
        faucet.id,
        faucet.sensor,
        FORMAT(SUM(flow*dt_h)%faucet.capacity,2) litros
    FROM   flow
          JOIN faucet
            ON ( flow.faucet_id = faucet.id )
    WHERE  faucet.branch_id = ${request_branch}
          AND faucet.activity = 1
    GROUP BY (faucet.id)`
    );

    return {
      statusCode: 200,
      data: { data },
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
