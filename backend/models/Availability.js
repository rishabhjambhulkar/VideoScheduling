const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: Number},
    scheduledSlots: {
      type: Map,
      of: [String],
    },
 
  });
  
  const Availability = mongoose.model('Availability', availabilitySchema);
  
  module.exports = Availability;
  