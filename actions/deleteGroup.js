const { Groups, referalGroups } = require("../schema/schema");

async function deleteGroup(groupId) {
  try {
    await Groups.deleteOne({ groupId });
    await referalGroups.deleteMany({ groupId });
  } catch (error) {
    console.log(error);
  }
}
module.exports = deleteGroup;
