const mongoose = require('mongoose')

const Todo = mongoose.model('ToDo', {
    tarefa: String,
    desc: String,
    categoria: String,
    situacao: {
        type: Boolean,
        default: false
    }
   
})

module.exports = Todo