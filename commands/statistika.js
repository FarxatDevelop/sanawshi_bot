const { bot } = require("../core/bot");
const { Users, Groups } = require("../schema/schema");

bot.command("statistika", async (ctx) => {
  try {
    const users = await Users.find();
    const groups = await Groups.find();

    ctx.reply(
      `<b>📊 Bot statistikası</b>

👤 Users:  <b>${users.length}</b>
👥 Groups:  <b>${groups.length}</b>`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Gruppaǵa qosiw",
                url: "https://t.me/members_counter_qq1_bot?startgroup=new",
              },
            ],
          ],
        },
        parse_mode: "HTML",
      }
    );
  } catch (error) {
    console.log(error);
  }
});
