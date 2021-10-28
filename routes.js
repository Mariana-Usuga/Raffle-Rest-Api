const express = require('express')
const controller = require('./controllers')

const app = express.Router()

app.get('/raffles', controller.listRaffle);
app.post('/raffles', controller.createRaffle)
app.get('/raffles/:id', controller.getRaffle)
app.post('/raffles/:raffleId/ticket', controller.buyTicket)
app.post('/raffles/:raffleId/play', controller.getWinner)

module.exports = app