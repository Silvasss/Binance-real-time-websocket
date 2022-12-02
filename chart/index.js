
const socket = io.connect('http://localhost:4000/', {transports: ['websocket', "polling"]})

socket.emit("changeCurrencyCoin", (['BTCUSDT', '1m']))

socket.on('KLINE', (pl) => {
    console.log(pl)
})