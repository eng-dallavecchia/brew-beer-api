import { rawNex } from "./../db/dbUtil";
import { add } from "./responseUtil";

export const revenuesByProduct = async (req, res) => {
  try {
    const { request_branch } = req.params;

    let data = await rawNex(
      `SELECT
	      product.id,
        product.name as nome,
        FORMAT(SUM(flow*dt_h),2) litros,
        FORMAT(SUM(flow*dt_h*price),2) faturamento,
      	MONTH(flow.date_creation) mes
    FROM   flow
          JOIN faucet
            ON ( flow.faucet_id = faucet.id )
          JOIN product
            ON ( product.id = faucet.product_id )
    WHERE  faucet.branch_id = ${request_branch}
          AND month(flow.date_creation) = month(Convert_tz(Now(), "+00:00", "-03:00"))
          AND flow.flow != 0

          GROUP BY (faucet.product_id)`
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

export const revenuesByProductType = async (req, res) => {
  try {
    const { request_branch } = req.params;

    let data = await rawNex(
      `SELECT
	     product_type.id,
       product_type.name as nome,
        FORMAT(SUM(flow*dt_h),2) litros,
        FORMAT(SUM(flow*dt_h*price),2) faturamento,
      	MONTH(flow.date_creation) mes
    FROM   flow
          JOIN faucet
            ON ( flow.faucet_id = faucet.id )
          JOIN product
            ON ( product.id = faucet.product_id )
            JOIN product_type
            ON (product_type.id = product.product_type_id)
    WHERE  faucet.branch_id = ${request_branch}
          AND month(flow.date_creation) = month(Convert_tz(Now(), "+00:00", "-03:00"))
          AND flow.flow != 0

          GROUP BY (product.product_type_id)`
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
