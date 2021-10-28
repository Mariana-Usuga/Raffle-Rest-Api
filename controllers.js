const Raffle = require('./Raffle')
const Ticket = require('./Ticket')

const listRaffle = async (req, res) => {
  try {
    const raffles = await Raffle.find().select('name closed ticketsAvailable winner')
    res.json(raffles)
  } catch (err) {
    console.log(err)
  }
}

const createRaffle = async (req, res) => {
  try {
    const { name, from, to } = await req.body
    const ticketsNumber = to - from
    const raffle = await Raffle.create({ name: name, from: from, to: to, closed: false,
      ticketsAvailable: ticketsNumber + 1 })
    for (let i = from; i <= to; i++) {
      const ticket = await Ticket.create({ number: i, raffle: raffle._id })
      raffle.tickets.push(ticket)
      await raffle.save()
    }
    res.status(201).json(raffle)
  } catch (err) {
    res.status(422).json({ error: err })
  }
}

const getRaffle = async (req, res) => {
  try {
    const raffle = await Raffle.find({ _id: req.params.id }).populate('tickets')
    res.json(raffle)
  } catch (err) {
    console.log(err)
  }
}

const buyTicket = async (req, res) => {
  try {
    const { number, name, email, phone } = req.body
    let ticket = await Ticket.findOne({ number, raffle: req.params.raffle_id })
    let raffle = await Raffle.findOne({ _id: req.params.raffle_id })
    if (raffle.winner.ticket) {
      res.status(409).json({ closed: raffle.closed, name: raffle.winner.name, 
        ticket: raffle.winner.ticket, response: 'Raffle is already closed' })
      return
    }
    if (!number || !name || !email || !phone) {
      res.status(422).json({ response: 'Missing values in the body' })
      return
    }
    if (!ticket) {
      res.status(404).json({ response: 'ticket not found' })
      return
    }
    if (!ticket.available) {
      res.status(409).json({ response: 'ticket not available' })
    } else {
      ticket = await Ticket.findOneAndUpdate({ _id: ticket._id },
        { $set: { available: false, buyer: { email, name, phone } } });
      res.json({ number, name, email, phone })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getWinner = async (req, res) => {
  try {
    const raffleId = req.params.raffleId
    console.log('raffleid', raffleId)
    const raffle = await Raffle.findById({ _id: raffleId })
    if (!raffle) {
      res.status(404).json({ response: 'raffle not found' })
      return
    }
    if (raffle.closed) {
      res.status(409).json({ response: 'raffle closed', winner: raffle.winner })
      return
    }
    let tickets = await Ticket.find({ raffle })
    const pos = Math.floor(Math.random() * tickets.length);
    if (!tickets[pos].buyer.name) {
      res.json({ response: 'ticket not sell', number: tickets[pos].number })
      return
    }
      setWinner(res, pos, raffle, tickets, raffleId)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const setWinner = async (res, pos, raffle, tickets, raffleId) => {
  let { ticket, email, name, phone } = raffle.winner
    ticket = tickets[pos].number
    name = tickets[pos].buyer.name
    email = tickets[pos].buyer.email
    phone = tickets[pos].buyer.phone
    raffle = await Raffle.findOneAndUpdate({ _id: raffleId },
      { $set: { winner: { ticket, email, name, phone }, closed: true } });
      res.json( { winner : name, ticket, email, phone } )
}

module.exports = { listRaffle, createRaffle, getRaffle, buyTicket, getWinner }