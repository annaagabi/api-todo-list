![header](https://64.media.tumblr.com/9f1a14a795b693c7aaf1b67aabdd75ee/89fde1ab0ef3e47c-85/s2048x3072/b2517d911a726aedc2023236185a298e7a133622.pnj)

# Tarefandoo - TODO List
Descrição... API - Back-End

:globe_with_meridians: API: https://tarefandoo.vercel.app/


## 1. Criando:
**No terminal:**
- [x] Inicializando o projeto (criar o package. json): `npm init -y`
- [x] Baixar framework: `npm i express​`
- [x] Mudar e reiniciar o projeto automaticamente: `npm i nodemon`
- [x] Configuração do banco de dados: `npm i mongoose`
- [x] Corrigir erros de servidor: `npm i cors`

## 2. Adicionar ao Script no Package.JSON:
- [x] Adicione ao package.json, na parte de “script” o: "start": "nodemon ./index.js localhost 3000"
```js
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "nodemon ./index.js localhost 3000"
},
```

## 3. Definição dos Tipos de Dados (Modelo) e Conexão com o Banco
- [x] Deverá ser criado um arquivo que conterá o modelo de dados, neste caso é “todo.js” e então importar o banco de dados para conectar no modelo de dados
```js
const mongoose = require('mongoose')
```

- [x] Em seguida, deverá ser criado os atributos que serão inseridos e sua tipagem de dados
```js
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
```

## 4. Iniciar o Banco e Conectar com a Porta de Serviço WEB
- [x] Importe as dependências e as inicialize
```js
const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')

const cors = require('cors')
app.use(cors())

app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())
```

- [x] Crie a rota principal para verificar se a API está funcionando
```js
const todoRoutes = require('./route/todoRoute')

app.use('/todo', todoRoutes)

app.get('/', (req,res) =>{
    res.json({message: 'Testando API'})
})
```

- [x] Agora deverá criar uma função para verificar se o banco de dados está funcionando e definir a porta em que a aplicação irá rodar
```js
mongoose.connect(process.env.MONGO) // conectar ao banco de dados
.then(() => {
    console.log("Conectamos ao mongo DB")
    const port = process.env.PORT || 3000;
    app.listen(port) // Vai ler a porta
    // app.listen(3000) 
})
.catch((err) => console.log(err))
```

## 5 - Definição das Rotas Bases e Conexão com o Modelo de Dados

### 5.1. Importando
- [x] Inicie importando as dependencias e os modelos de dados
```js
const express = require('express')
const router = express.Router()
const Todo = require('../model/todo')

const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
```

### 5.2. Rota POST
- [x] Definição da rota para criação de dados
```js
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
```

### 5.3. Rota GET
- [x] Definição da rota para exibição todos os dados
```js
router.get('/', async(req, res) =>{
    try{
        const todo = await Todo.find()

         // status 200: a requisição foi realizada com sucesso
         res.status(200).json(todo)
    } catch(error){
        res.status(500).json({error: error})
    }
})
```

- [x] Definição da rota para exibição de dados especificos (serão "resgatados" pelo id)
```js
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
```

### 5.4. Rota PATCH
- [x] O PATCH faz uma atualização parcial dos dados
- [x] Definição da rota para atualização de dados específicos
```js
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
```

### 5.5. Rota DELETE
- [x] Definição da excluir dados específicos
```js
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
```

### 5.5. Exportar
- [x] Exportar o arquivo das rotas
```js
module.exports = router;
```

## 6. Endpoints
### 6.1 Para Verificar se a API Está Funcionando
- [x] {{URL}}/
- [x] https://tarefandoo.vercel.app/

### 6.2 Para Acessar Todas as Tarefas
- [x] {{URL}}/todo
- [x] https://tarefandoo.vercel.app/todo

### 6.3 Para Acessar, Deletar ou Atualizar uma Tarefa Especifica:
- [x] {{URL}}/todo/id
- [x] https://tarefandoo.vercel.app/todo/65c29e4d7001ea2779ca351f

## Links
[![Figma](https://skillicons.dev/icons?i=figma)](https://www.figma.com/file/jJAFOw9cvpalCkMacMPZJ7/Tarefandoo?type=design&node-id=437-3&mode=design&t=622nry1CTlPBRAPQ-0) [![Vercel](https://skillicons.dev/icons?i=vercel)](https://tarefandoo.vercel.app/) [![GitHub](https://skillicons.dev/icons?i=github)](https://github.com/annaagabi/api-todo-list)


## Autores

- [@annaagabi](https://www.github.com/annaagabi)
- [@Doyklas](https://www.github.com/Doyklas)
- [@GabrielaLimadaLuz](https://www.github.com/GabrielaLimadaLuz)
- [@GeoGustin](https://www.github.com/GeoGustin)
- [@Hepteto](https://www.github.com/Hepteto)
