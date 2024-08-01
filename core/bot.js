const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bot = new Telegraf(process.env.TOKEN);
const PORT = process.env.PORT;
bot.telegram.setMyCommands([
  {
    command: "start",
    description: "Baslaw",
  },
  {
    command: "my_members",
    description: "Men qosqan adamalar sani",
  },
  {
    command: "your_members",
    description: "Sen qosqan adamlar sani",
  },
]);

const startFn = async () => {
  try {
    app.use(
      await bot.createWebhook({
        domain: "https://sanawshi-bot.onrender.com",
      })
    );
    app.listen(PORT, () => console.log("Listening on port", PORT));

    await mongoose.connect(process.env.MONGODB_URL);
    bot.launch({ dropPendingUpdates: true });
  } catch (error) {
    console.log(error);
  }
};

startFn();
module.exports = { bot };
