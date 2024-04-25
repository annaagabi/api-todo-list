// config inicial
const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')

const cors = require('cors')
app.use(cors())

// Forma de ler JSON/ middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())

// Rotas da API
const todoRoutes = require('./route/todoRoute')

app.use('/todo', todoRoutes)

// Rota/ Endpoint inicial
app.get('/', (req,res) =>{
    res.json({message: 'Testando API'})
})

// entregar uma porta
mongoose.connect(process.env.MONGO) // conectar ao banco de dados
.then(() => {
    console.log("Conectamos ao mongo DB")
    const port = process.env.PORT || 3000;
    app.listen(port) // Vai ler a porta
    // app.listen(3000) 
})
.catch((err) => console.log(err))
