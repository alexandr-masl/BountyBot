import { mongoose } from 'mongoose';

const mongoose = require("mongoose");

const bountyIdTableSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: String, // Defines each value in the map as a string
    required: true,
  },
});

export const bountyIdModel = mongoose.model("BountyIdTable", bountyIdTableSchema);
