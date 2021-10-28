const mongoose = require("mongoose")

var ticketSchema = mongoose.Schema({
   number: {
      type: Number,
      required: [true,  'Number is required'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    buyer: {
      email: { type: String, default: "" },
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    raffle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Raffle",
      required: true,
    },
});

// definimos el modelo
module.exports = mongoose.model("Ticket", ticketSchema);