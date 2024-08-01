const { Groups } = require("../schema/schema");

async function newGroup(groupId, groupName, groupType, msg) {
  try {
    let group = await Groups.findOne({ groupId });
    if (!group) {
      Groups.create({
        groupId,
        groupName,
        groupType,
      });
      try {
        msg.reply("Hello new group");
      } catch (error) {
        console.log("Xabar jiberilmedi");
      }
    } else {
      group.groupName = groupName;
      group.groupType = groupType;
      await group.save();
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = newGroup;
