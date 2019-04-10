import { mqttClient } from "./../mqtt";

export const factorCalibration = async (req, res) => {
  const { calibrationNumber, sensorId } = req.body;
  
  const client = await mqttClient(process.env.MQTT_BROKER);

  const topic = process.env.MQTTUSER + "/calibration/" + sensorId;

  client.publish(topic, calibrationNumber, 1, err => {
    if (err) {
      res.json({ message: err });
    }
    return res.json({
      statuscode: 200,
      message: "Calibração efetuada com sucesso!"
    });
  });
};
