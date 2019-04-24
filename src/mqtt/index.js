import {} from "dotenv/config";
import mqtt from "mqtt"; //https://www.npmjs.com/package/mqtt
import { insert } from "./../db/dbUtil";
import { findOne } from "./../db/dbUtil";

export const mqttClient = Broker_URL => {
  let options = {
    clientId: process.env.CLIENTID,
    port: process.env.MQTTPORT,
    username: process.env.MQTTUSER,
    password: process.env.MQTTPASS,
    keepalive: 60
  };
  let client = mqtt.connect(Broker_URL, options);

  return client;
};

export const mqttResponse = () => {
  let Topic = process.env.MQTT_TOPIC; //subscribe to all topics
  let Broker_URL = process.env.MQTT_BROKER;

  let delimiter = " : ";

  function countInstances(message_str) {
    let substrings = message_str.split(delimiter);
    return substrings.length - 1;
  }

  let options = {
    clientId: process.env.CLIENTID,
    port: process.env.MQTTPORT,
    username: process.env.MQTTUSER,
    password: process.env.MQTTPASS,
    keepalive: 60
  };

  let client = mqttClient(Broker_URL);

  client.on("connect", mqtt_connect);
  client.on("reconnect", mqtt_reconnect);
  client.on("error", mqtt_error);
  client.on("message", mqtt_messsageReceived);
  client.on("close", mqtt_close);

  function mqtt_connect() {
    //console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);

  }

  function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) {
      console.log(err);
    }
  }

  function mqtt_reconnect(err) {
    client = mqtt.connect(Broker_URL, options);
  }

  function mqtt_error(err) {
    if (err) {
      console.log("error MQTT", err);
    }
  }

  //receive a message from MQTT broker
  function mqtt_messsageReceived(topic, message, packet) {
    let message_str = message.toString(); //convert byte array to string
    message_str = message_str.replace(/\n$/, ""); //remove new line
    //payload syntax: clientID,topic,message

    if (countInstances(message_str) != 1) {
      console.log(countInstances(message_str));
      console.log(message_str);
      console.log("Invalid payload");
    } else {
      insert_message(topic, message_str, packet);
      //console.log(message_arr);
    }
  }

  function mqtt_close() {
    //console.log("Close MQTT");
  }

  // insere os dados do sensor no banco de dados
  async function insert_message(topic, message_str, packet) {
    try {
      let topic_split = topic.split("/");
      let topic_sensor = topic_split[2];

      let readings = message_str.split(" : ");

      let req_faucet = await findOne("faucet", {
        sensor: topic_sensor,
        activity: 1
      });
      // + Math.random()*30
      await insert("flow", {
        flow: readings[0] * 60 + Math.random() * 30,
        sensor_code: topic_sensor,
        dt_h: readings[1] / (1000 * 3600),
        faucet_id: req_faucet.id
      });

      countInstances(message_str);
    } catch (err) {
      console.log(err);
    }
  }
};



export default mqttResponse;
