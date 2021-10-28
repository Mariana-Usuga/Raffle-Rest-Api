const mongoose = require("mongoose")

var raffleSchema = mongoose.Schema({
  name: String,
  from: Number,
  to: Number,
  closed: Boolean,
  ticketsAvailable: Number,
  winner: {
    ticket : { type: String, default: "" },
    email: { type: String, default: "" },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
},
});

// definimos el modelo
module.exports = mongoose.model("Raffle", raffleSchema);