const { bot } = require("../core/bot");
const { isBotAdmin, isGroup } = require("../middlewares");
const { referalGroups } = require("../schema/schema");

bot.command("my_members", isGroup, isBotAdmin, async (ctx) => {
  try {
    const groupId = ctx.chat.id;
    const userId = ctx.from.id;
    const userName = ctx.from.first_name;
    const megID = ctx.message.message_id;
    const currentGroup = await referalGroups.findOne({ groupId, userId });
    if (currentGroup) {
      try {
        ctx.reply(
          `<b><a href="tg://user?id=${userId}">${userName}</a>, siz ${currentGroup.referalIds.length} adam qosqansız</b>`,
          {
            parse_mode: "HTML",
          }
        );
      } catch (error) {
        console.log("Xabar yuborilmadi");
      }
    } else {
      try {
        ctx.reply(
          `<b><a href="tg://user?id=${userId}">${userName}</a>, siz hesh adam qospaǵansız</b>`,
          {
            parse_mode: "HTML",
          }
        );
      } catch (error) {
        console.log("Xabar yuborilmadi");
      }
    }
    ctx.telegram.deleteMessage(groupId, megID);
  } catch (error) {
    console.log(error);
  }
});
