# Instrucoes para rodar o projeto

Para rodar a aplicacao completa voce vai precisar de pelo menos dois terminais abertos ao mesmo tempo — um para a API e outro para o frontend. O Node-RED roda separado tambem.

---

## Requisitos

- Node.js v18 ou superior
- Node-RED instalado globalmente:

```bash
npm install -g --unsafe-perm node-red
```

---

## Passo a passo

### Terminal 1 — API

Entre na pasta `api` e instale as dependencias:

```bash
cd api
npm install
npm start
```

A API vai rodar em `http://localhost:8080`. Se aparecer a mensagem `API rodando na porta 8080` esta tudo certo.

---

### Terminal 2 — Frontend

Entre na pasta `frontend` e instale as dependencias:

```bash
cd frontend
npm install
npm run dev
```

O frontend vai rodar em `http://localhost:3000`.

---

### Terminal 3 — Node-RED

Inicie o Node-RED:

```bash
node-red
```

Acesse `http://localhost:1880` no navegador e importe o fluxo:

1. Clique no menu (tres linhas no canto superior direito)
2. Va em **Import**
3. Selecione o arquivo `node-red/file.json`
4. Clique em **Import** e depois em **Deploy**

Pronto. O Node-RED vai comecar a enviar dados de sensores simulados para a API a cada 5 segundos.

---

## Ordem recomendada

1. Iniciar a API primeiro
2. Iniciar o Node-RED e fazer o deploy do fluxo
3. Iniciar o frontend por ultimo

Essa ordem garante que o Node-RED ja encontra a API no ar quando comecar a enviar dados.

---

## Portas utilizadas

| Servico | Porta |
|---|---|
| API | 8080 |
| Frontend | 3000 |
| Node-RED | 1880 |

---

## Observacoes

- Os dados sao armazenados em memoria. Ao reiniciar a API tudo e perdido.
- O `opcua-server/server.py` e um servidor OPC-UA de referencia, nao e necessario rodar para o projeto funcionar.
- A collection do Postman em `postman/Painel_IoT.postman_collection.json` pode ser usada para testar os endpoints da API diretamente.
