import schedule from "node-schedule";
import axios from "axios";
import _ from "lodash";
import configs from "../configs";

schedule.scheduleJob("* * * * *", async () => {
  try {
    const serverUrl: string = _.get(configs, "app.serverUrl", "");
    const response = await axios.get(`${serverUrl}/ping`);
    console.log(`Scheduled request sent: ${response.status}`);
  } catch (error) {
    console.error("Error sending scheduled request:", error);
  }
});
