const express = require("express");
const cors = require("cors");

// UUID - 
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // Retornando um array com todos os repositories 
  response.send(repositories);
});

app.post("/repositories", (request, response) => {
  // Dados do corpo da requisição
  const { title, url, techs } = request.body;

  // Criando um objeto
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  // Adicionando um novo repositorio na lista
  repositories.push(repository);

  // Retornando um json - critério do teste 
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // Armazenando os updates do corpo da requisição
  const { title, url, techs } = request.body;
  // Armazenando o id que será feito o update
  const {id} = request.params;
  
  // Encontrando o repository para o update
  let repo = repositories.find( repo => {
    return repo.id === id
  });
   
  if (!repo)
    return response.status(400).json({ error: "Repository not found." })
  
  // "..." recupera os outros dos atributos do objeto
  // Faz com que os likes não alterem de maneira manual
  repo = {...repo, title, url, techs}

  return response.json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  // Id presente na requisição
  const { id } = request.params;

  // Indice na lista repositorio do id
  const indexRepository = repositories.findIndex(repository => {
    return repository.id === id;
  })

  if (indexRepository < 0){
    return response.status(400).send();
  }

  // Exclusão
  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // Id dos parametros
  const { id } =  request.params;

  // Encontrar o repositorio do id
  const repository = repositories.find(repository => {
    return repository.id === id;
  })

  // Caso o repositorio não exista
  if (!repository) {
      return response.status(400).send();
  }

  // Adicionando o like no repositorio
  repository.likes += 1;
  
  // Retornando um json - critério do teste 
  return response.json(repository);
});

module.exports = app;
