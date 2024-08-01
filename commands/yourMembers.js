const { bot } = require("../core/bot");
const { isBotAdmin, isGroup } = require("../middlewares");
const { referalGroups } = require("../schema/schema");

bot.command("your_members", isGroup, isBotAdmin, async (ctx) => {
  try {
    if (!ctx.update.message.reply_to_message) {
      ctx.reply(
        `<b>Siz gruppaǵa kim qansha adam qosqanlıǵın biliw ushın\nsol adamǵa (reply) etip, /your_members sózin jıberiwińiz kerek!</b>`,
        {
          parse_mode: "HTML",
          reply_parameters: {
            message_id: ctx.message.message_id,
            chat_id: ctx.chat.id,
          },
        }
      );
      return;
    }
    const userId = ctx.update.message.reply_to_message.from.id;
    const userName = ctx.update.message.reply_to_message.from.first_name;
    const groupId = ctx.chat.id;
    const msgID = ctx.message.message_id;
    const currentGroup = await referalGroups.findOne({ groupId, userId });

    if (currentGroup) {
      ctx.reply(
        `<b><a href="tg://user?id=${userId}">${userName}</a>, siz ${currentGroup.referalIds.length} adam qosqansız</b>`,
        {
          parse_mode: "HTML",
        }
      );
    } else {
      ctx.reply(
        `<b><a href="tg://user?id=${userId}">${userName}</a>, siz hesh adam qospaǵansız</b>`,
        {
          parse_mode: "HTML",
        }
      );
    }
    ctx.telegram.deleteMessage(groupId, msgID);
  } catch (error) {
    console.log("Error");
  }
});
