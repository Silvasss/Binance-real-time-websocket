const api = require('binance')
const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()


app.use(cors({origin: '*'}))

const http2 = require('http').Server(app)

const server = app.listen(process.env.PORT || '4329', () => console.log('Data Server started on port 4000'))

const socket = require('socket.io')(http2)

const io = socket.listen(server)

const binanceWS = new api.BinanceWS(true)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

var values = null


io.on('connection', (socket) => {
    const callbacks = {
        open: () => {
            console.log('open')

            socket.emit('open', 'open')
        },
        close: () => {
            console.log('close')

            socket.emit('close', 'close')
        },
        message: (msg) => {
            console.log(msg)

            console.log('---')

            socket.emit('message', msg)
        },
    }

    socket.on('changeCurrencyCoin', (valuesCall) => {
        console.log(valuesCall)

        values = binanceWS.onKline(valuesCall[0], valuesCall[1], (data) => {
            io.emit('KLINE', {time: Math.round(data.kline.startTime/1000), open: parseFloat(data.kline.open), high: parseFloat(data.kline.high), low: parseFloat(data.kline.low), final: (data.kline.final), callbacks})
        })
    })

    socket.on('disconnect', () => {
        console.log('Disconnect')

        try {
            values.close()
        } catch (error) {
            // pass
        }
    })
})