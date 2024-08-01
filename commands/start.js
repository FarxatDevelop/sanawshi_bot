const { bot } = require("../core/bot");
const { Users } = require("../schema/schema");
const { utils } = require("../utils/utils");

bot.start(async (msg) => {
  try {
    const { id, first_name, username } = msg.from;
    if (msg.chat.type == "private") {
      const isExist = await Users.findOne({ userId: id });
      if (!isExist) {
        await Users.create({
          userId: id,
          firstName: first_name,
          userName: username,
        });
        msg.telegram.sendMessage(
          utils.adminIDs[0],
          `<b> Jana paydaliwshi🥳

Ati: <a href="tg://user?id=${id}">${first_name}</a>
Username:  ${username ? "@" + username : "Joq"}

/statistika</b>`,
          { parse_mode: "HTML" }
        );
      }
    }
    msg.reply(
      `<b>Botqa xosh kelipsiz, <a href="tg://user?id=${id}">${first_name}</a></b>

📊Men Gruppaǵa kim qansha adam qosqanlıǵın aytıp beretuǵın botpan.

<b>Bot arqalı Gruppańizǵa qálegenshe adam jıynap alasız 😊</b>

<b>⚠️ Bot duris islewi ushın ADMIN huqıqın beriwińiz kerek</b>`,
      {
        parse_mode: "HTML",
      }
    );
  } catch (error) {
    console.log(error);
  }
});
