const express = require('express')
const cors = require('cors')
const api = express()

//Middlewares
api.use(express.json())
api.use(cors())

const dados = []
let id = 0;

//Rotas
api.get('/usuarios', (req, res)=>{
    let users = dados;

    res.status(200).send(users)
})


api.post('/novoUsuario',(req, res)=>{
    if(dados.length <= 0){
        id = 0;
    }
    id = id + 1; //incremento
    
    let user = {
        id: id,
        nome_completo: req.body.nome_completo,
        email: req.body.email,
        senha: req.body.senha
    }
    dados.push(user)
    res.status(201).send({
        code: 201,
        msg: "Usuário Criado com sucesso!"})
})
api.delete('/usuarios/:id', (req, res)=>{
    let id = req.params.id
    let index = dados.findIndex(p => p.id === parseInt(id))

    if(index !== -1){
        dados.splice(index, 1);
        
        return res.status(200).send({
            code: 200,
            msg: "Usuário deletado com sucesso!"
        })
    }
    else{
        return res.status(404).send({
            code: 404,
            msg: "Usuário não encontrado"
        })
    }

})
api.put('/usuarios/:id', (req, res)=>{
    let id = req.params.id
    let newBody = req.body
    let index = dados.findIndex(p => p.id === parseInt(id))

    if(index !== -1){
        dados[index] = {id: parseInt(id), ...newBody}
        return res.status(200).send({
            code: 200,
            msg: "Usuário editado com sucesso!"
        })
    }
    else{
        return res.status(404).send({
            code: 404,
            msg: "Usuário não encontrado"
        })
    }
})



const porta = 8080;
api.listen(porta, ()=>{
    console.log(`API rodando na porta ${porta}`)
})