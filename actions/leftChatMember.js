const { bot } = require("../core/bot");
const deleteGroup = require("./deleteGroup");

bot.on("left_chat_member", async (ctx) => {
  try {
    const groupId = ctx.update.message.chat.id;
    if (ctx.update.message.left_chat_member.id == ctx.botInfo.id) {
      deleteGroup(groupId);
      return;
    }
    const messageId = ctx.update.message.message_id;
    try {
      ctx.telegram.deleteMessage(groupId, messageId);
    } catch (error) {
      console.log("Xabar ochirilmadi");
    }
  } catch (error) {
    console.log(error);
  }
});
