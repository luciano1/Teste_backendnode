const express = require('express');
const fs = require('fs');
const cors = require('cors');
const server = express();

server.use(cors());
server.use(express.json());

let users = [];

//l usuários no arquivo
async function buscaUsuarios() {
    var users_temp = fs.readFileSync("./database.txt", 'utf8');
    users = JSON.parse(users_temp);
    //console.log(users);
}

//Faz um log pra cada função  
server.use((req, res, next) => {
    console.log(`Método: ${req.method}; URL: ${req.url}`);
    buscaUsuarios();
    return next();
})

//Lista todos os usuários
server.get('/users', (req, res) => {
    return res.json(users);
})

//Pesquisar usuário X
server.get('/users/:busca', (req, res) => {
    const { busca } = req.params;
    buscaUsuarios();
    var users_searched = [];

    var filtered = users.filter(function (obj) {
        if ((obj.name.toLowerCase().indexOf(busca.toLowerCase()) >= 0) ||
            (obj.cpf == busca.toLowerCase() >= 0) ||
            (obj.idade.indexOf(busca.toLowerCase()) >= 0) ||
            (obj.email.toLowerCase().indexOf(busca.toLowerCase()) >= 0)) {

            users_searched.push(obj);
        }
    });

    return res.json(users_searched);
})

//Cadastrar usuario
server.post('/users', (req, res) => {
    const { name, cpf, age, email } = req.body;
    buscaUsuarios();
    users.push({ 'name': name, 'cpf': cpf, 'idade': age, 'email': email });
    fs.writeFileSync("./database.txt", JSON.stringify(users));

    return res.json(users);
});


server.listen(3003); 
