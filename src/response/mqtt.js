import { mqttClient } from "./../mqtt";

export const factorCalibration = async (req, res) => {
  let client = await mqttClient(process.env.MQTT_BROKER);

  const { calibrationNumber, sensorId } = req.params;
  let topic = process.env.MQTTUSER + "/calibration/" + sensorId;

  client.publish(topic, calibrationNumber, err => {
    if (err) {
      res.json({ message: err });
    }
    return res.json({
      statuscode: 200,
      message: "Calibração efetuada com sucesso!"
    });
  });
};
