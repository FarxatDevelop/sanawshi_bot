const { bot } = require("../core/bot");
const { referalGroups } = require("../schema/schema");
const newGroup = require("./newGroup");

bot.on("new_chat_members", async (ctx) => {
  try {
    const groupId = ctx.chat.id;
    const newMembers = ctx.message.new_chat_members;
    const addedUserId = ctx.from.id;
    const messageId = ctx.message.message_id;
    const groupName = ctx.chat.title;
    const groupType = ctx.chat.type;
    const member = await ctx.telegram.getChatMember(groupId, ctx.botInfo.id);
    if (member.status == "administrator") {
      if (newMembers[0].id == addedUserId) return;

      const newUsers = [];
      newMembers.map((newMember) => {
        if (newMember.id !== ctx.botInfo.id) {
          newUsers.push(newMember.id);
        }
      });

      const currentGroup = await referalGroups.findOne({
        groupId,
        userId: addedUserId,
      });

      if (!currentGroup && newUsers.length > 0) {
        referalGroups.create({
          groupName,
          userId: addedUserId,
          groupId,
          referalIds: newUsers,
        });
      } else {
        await referalGroups.findOneAndUpdate(
          { groupId, userId: addedUserId },
          {
            $push: { referalIds: { $each: newUsers } },
            $set: { groupName: groupName },
          },
          { new: true, upsert: false }
        );
      }
      try {
        ctx.telegram.deleteMessage(groupId, messageId);
      } catch (error) {
        console.log("Xabar ochirilmadi");
      }
    }
  } catch (error) {
    console.log(error);
  }
});
