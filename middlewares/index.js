const newGroup = require("../actions/newGroup");
const { bot } = require("../core/bot");
const { Groups, referalGroups } = require("../schema/schema");
bot.use(async (ctx, next) => {
  const newChatMembers = ctx?.message?.new_chat_members;
  const groupId = ctx.chat.id,
    groupName = ctx.chat.title,
    groupType = ctx.chat.type;

  if (newChatMembers) {
    newChatMembers.map((newUser) => {
      if (newUser.id == ctx.botInfo.id) {
        newGroup(groupId, groupName, groupType, ctx);
      }
    });
  }
  next();
});
bot.use(async (ctx, next) => {
  try {
    if (!ctx.command) {
      return next();
    }
    if (["group", "supergroup"].includes(ctx.chat.type)) {
      try {
        const chatAdmins = await ctx.getChatAdministrators(ctx.chat.id);
        const isBotAdmin = chatAdmins.some(
          (admin) => admin.user.id === ctx.botInfo.id
        );
        if (isBotAdmin) {
          try {
            await ctx.reply("Admin ushin raxmet");
            return next();
          } catch (error) {
            console.log(error);
          }
        } else {
          if (!sentMessages.has(ctx.chat.id)) {
            sentMessages.add(ctx.chat.id);
            await ctx.reply(
              "Menga admin bering. Admin berilmasa men qoshgan odamlarni sanamayman"
            );
          }
        }
      } catch (error) {
        if (logMessages.has("loged")) {
          console.log("Bot shiqti");
          logMessages.delete("loged");
          return next();
        } else {
          logMessages.add("loged");
        }
      }
    } else {
      return next();
    }
  } catch (error) {
    console.log("Xato");
  }
});
bot.use(async (ctx, next) => {
  const migrateId = ctx.update.message?.migrate_to_chat_id;
  if (migrateId) {
    try {
      const oldGroup = await Groups.findOne({ groupId: ctx.chat.id });
      const temporaryStore = {
        groupName: oldGroup.groupName,
      };
      await Groups.create({
        groupId: migrateId,
        groupName: temporaryStore.groupName,
        groupType: ctx.chat.type,
      });
      await referalGroups.updateMany(
        { groupId: ctx.chat.id },
        { $set: { groupId: migrateId } }
      );
      await Groups.deleteOne({ groupId: ctx.chat.id });
      next();
    } catch (error) {
      console.log("Xato");
    }
  } else {
    return next();
  }
});
const isGroup = (ctx, next) => {
  if (["supergroup", "group"].includes(ctx.chat.type)) next();
  else
    ctx.reply(
      "<b>❗️Bul funksiya gruppada isleydi. Gruppaǵa jiberiǵ</b>\nMeni Gruppaǵa qosin",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Gruppaǵa qosiw",
                url: `https://t.me/${ctx.botInfo.username}?startgroup=new`,
              },
            ],
          ],
        },
        parse_mode: "HTML",
      }
    );
};

const isBotAdmin = async (ctx, next) => {
  try {
    const myBot = await ctx.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id);
    if (myBot.status == "administrator") next();
    else {
      const administrator = await ctx.getChatAdministrators(ctx.from.id);
      administrator.map((admin) => {
        ctx.reply(
          `<b><a href="tg://user?id=${admin.user.id}">${admin.user.first_name}</a>, Bot islewi ushın magan ADMIN berin 🫡</b>`,
          {
            parse_mode: "HTML",
          }
        );
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { isBotAdmin, isGroup };
