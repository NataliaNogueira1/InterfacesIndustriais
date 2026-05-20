# IFACI — Interface Industrial de Alta Performance

Projeto desenvolvido para a disciplina de Interfaces Industriais.
Aplicacao full-stack para gerenciamento de usuarios, equipamentos, dispositivos e sensores IoT, com integracao ao Node-RED para recebimento e notificacao de eventos em tempo real.

---

## Arquitetura geral

```
Frontend (Next.js)          API (Express)           Node-RED
http://localhost:3000  -->  http://localhost:8080  <-->  http://localhost:1880
```

O frontend se comunica exclusivamente com a API via HTTP REST.
A API notifica o Node-RED sempre que ocorre um evento de CRUD (criacao, edicao ou exclusao).
O Node-RED tambem envia dados de sensores simulados para a API a cada 5 segundos.

---

## Estrutura de pastas

```
IFACI/
├── api/
│   ├── server.js          # API Express — todas as rotas
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── CriarUsuario.tsx
│   │   │   ├── ListarUsuario.tsx
│   │   │   ├── CriarEquipamentos.tsx
│   │   │   └── ListarEquipamentos.tsx
│   │   ├── equipamentos/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── package.json
├── node-red/
│   └── file.json          # Fluxo para importar no Node-RED
└── postman/
    └── Painel_IoT.postman_collection.json
```

---

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Automacao IoT | Node-RED |
| Testes de API | Postman |

---

## Como rodar

### Requisitos

- Node.js v18 ou superior
- Node-RED instalado (`npm install -g --unsafe-perm node-red`)

### 1. API

```bash
cd api
npm install
npm start
```

Disponivel em `http://localhost:8080`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Disponivel em `http://localhost:3000`

### 3. Node-RED

```bash
node-red
```

Acesse `http://localhost:1880`, va em Menu → Import, selecione o arquivo `node-red/file.json` e clique em Deploy.

---

## Endpoints da API

Base URL: `http://localhost:8080`

### Usuarios

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/usuarios` | Lista todos os usuarios |
| POST | `/novoUsuario` | Cria um novo usuario |
| PUT | `/usuarios/:id` | Edita um usuario |
| DELETE | `/usuarios/:id` | Remove um usuario |

```json
// POST /novoUsuario
{ "nome_completo": "Maria Silva", "email": "maria@email.com", "senha": "123456" }
```

### Equipamentos

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/equipamentos` | Lista todos os equipamentos |
| POST | `/equipamentos` | Cria um equipamento |
| PUT | `/equipamentos/:id` | Edita um equipamento |
| DELETE | `/equipamentos/:id` | Remove um equipamento |

```json
// POST /equipamentos
{ "nome": "Compressor A" }
```

### Dispositivos

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/dispositivos` | Lista todos os dispositivos |
| GET | `/dispositivos/:id` | Busca dispositivo por id |
| POST | `/dispositivos` | Cria um dispositivo |
| PUT | `/dispositivos/:id` | Edita um dispositivo |
| DELETE | `/dispositivos/:id` | Remove um dispositivo |
| POST | `/dispositivos/:id/rele` | Libera ou trava o rele de seguranca |
| POST | `/dispositivos/:id/conexao` | Libera ou bloqueia a conexao |

```json
// POST /dispositivos
{ "equipamentoId": 1, "statusDispositivo": "online", "conexaoAtiva": true }

// POST /dispositivos/:id/rele
{ "trava_seguranca": true }

// POST /dispositivos/:id/conexao
{ "conexaoAtiva": false }
```

### Sensores IoT

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/iot` | Lista todos os dados de sensores |
| GET | `/sensor/:id` | Busca sensor por id |
| POST | `/newData` | Cria sensor via Node-RED |
| POST | `/sensor` | Cria sensor manualmente |
| PUT | `/sensor/:id` | Atualiza sensor (upsert) |
| DELETE | `/sensor/:id` | Remove um sensor |

```json
// POST /sensor
{
  "dispositivoId": 1,
  "temperatura": 28.5,
  "pressao": 1013.2,
  "umidade": 60.0,
  "sensor_presenca": false,
  "trava_seguranca": false
}
```

---

## Integracao Node-RED

A API notifica o Node-RED nos seguintes eventos:

| Evento | Endpoint Node-RED |
|---|---|
| Equipamento criado | POST `/equipamento-criado` |
| Equipamento editado | POST `/equipamento-editado` |
| Equipamento deletado | POST `/equipamento-deletado` |
| Dispositivo criado | POST `/dispositivo-criado` |
| Dispositivo editado | POST `/dispositivo-editado` |
| Dispositivo deletado | POST `/dispositivo-deletado` |
| Sensor criado | POST `/sensor-criado` |
| Sensor editado | POST `/sensor-editado` |
| Sensor deletado | POST `/sensor-deletado` |

O Node-RED tambem envia dados simulados de sensores para a API a cada 5 segundos via `PUT /sensor/1`.

---

> A collection do Postman com todos os endpoints esta disponivel em `postman/Painel_IoT.postman_collection.json`
