import { rawNex } from "./../db/dbUtil";

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

