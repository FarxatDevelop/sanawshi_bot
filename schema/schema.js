const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  userName: { type: String },
});

const groupSchema = new Schema({
  groupId: { type: Number, required: true },
  groupName: { type: String, required: true },
  groupType: { type: String, required: true },
});

const referalGroupsSchema = new Schema({
  groupName: { type: String, required: true },
  groupId: { type: Number, required: true },
  userId: { type: Number, required: true },
  referalIds: { type: Array, required: true },
});

const Users = model("users", userSchema);
const Groups = model("groups", groupSchema);
const referalGroups = model("referalgroups", referalGroupsSchema);

module.exports = { Users, Groups, referalGroups };
