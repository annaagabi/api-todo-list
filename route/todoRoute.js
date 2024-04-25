
const express = require('express')
const router = express.Router()
const Todo = require('../model/todo')

const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())


// Rotas da API

// Create - criação de dados

router.post('/', async (req, res) => {
    const{ tarefa, desc, categoria, situacao} = req.body

    if(!tarefa){
        res.status(422).json({error: 'O titulo da tarefa é obrigatório!'})
        return
    }

    const todoData = {
        tarefa, 
        desc, 
        categoria, 
        situacao: situacao || false
       
    }

// Cria dados no sistema

    try{
        // criando dados
        await Todo.create(todoData)

        // recurso criado com sucesso
        res.status(201).json({message: 'Tarefa inserida no sistema com sucesso'})
    } catch(error){
        res.status(500).json({error: error})
    }

})

// Read - Leitura de dados
router.get('/', async(req, res) =>{
    try{
        const todo = await Todo.find()

         // status 200: a requisição foi realizada com sucesso
         res.status(200).json(todo)
    } catch(error){
        res.status(500).json({error: error})
    }
})

// Rotas dinâmicas
router.get('/:id' , async(req, res) =>{

    // Extrai o dado da requisição pela url = req.params
    const id = req.params.id

    try{
        const todo = await Todo.findOne({_id: id})

        if(!todo){
            res.status(422).json({message: 'A tarefa não foi encontrada'})
            return
        }

        res.status(200).json(todo)

    } catch(error){
        res.status(500).json({error: error})
    }
})

// Updadte - atualização de dados (PUT, PATCH)
// PUT - espera que mandemos um objeto completo para realizar a atualização de registro do sistema
// PATCH - Atualização parcial

router.patch('/:id', async(req, res) =>{
    //a url vai vir com o id do usuario
    const id = req.params.id

    // o corpo vai vir com os dados que precisam ser atualizados
    const{ tarefa, desc, categoria, situacao } = req.body
   // const{ tarefa, body, comments, date } = req.body

    const todoData = {
        tarefa, 
        desc,
        categoria, 
        situacao: situacao || false
   
    }

    try{
        const updatedTodo = await Todo.updateOne({_id: id}, todoData)

         // Se não atualizou nada
        if(updatedTodo.matchedCount === 0 ) { // validação de existencia de todo
            res.status(422).json({message: 'A tarefa não foi encontrado'})
            return 
        }

        res.status(200).json(todoData)

    }catch(error){
        res.status(500).json({error: error})
    }
})

// Delete - deletar dados

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const todo = await Todo.findOne({ _id: id });

        if (!todo) {
            return res.status(404).json({ message: 'A tarefa não foi encontrada' });
        }

        await Todo.deleteOne({ _id: id });
        return res.status(200).json({ message: 'A tarefa removida com sucesso' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;