const express = require('express');
const cors = require('cors');
const api = express();

// Middlewares
api.use(express.json());
api.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// Notifica o Node-RED sobre eventos sem bloquear a resposta da API
const notificaNodeRed = async (endpoint, payload) => {
    try {
        await fetch(`http://localhost:1880${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (erro) {
        console.warn(`Node-RED (${endpoint}) indisponivel:`, erro.message);
    }
};

// =====================
// USUARIOS
// =====================
const dadosUsuarios = [];
let idUsuario = 0;

api.get('/usuarios', (req, res) => {
    res.status(200).send(dadosUsuarios);
});

api.post('/novoUsuario', (req, res) => {
    idUsuario++;
    const usuario = { id: idUsuario, ...req.body };
    dadosUsuarios.push(usuario);
    res.status(201).send({ code: 201, msg: "Usuario criado com sucesso!", usuario });
});

api.put('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = dadosUsuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).send({ code: 404, msg: "Usuario nao encontrado" });

    dadosUsuarios[index] = { id, ...req.body };
    res.status(200).send({ code: 200, msg: "Usuario atualizado com sucesso!" });
});

api.delete('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = dadosUsuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).send({ code: 404, msg: "Usuario nao encontrado" });

    dadosUsuarios.splice(index, 1);
    res.status(200).send({ code: 200, msg: "Usuario removido com sucesso!" });
});

// =====================
// EQUIPAMENTOS
// =====================
const dadosEquipamentos = [];
let idEquipamento = 0;

api.get('/equipamentos', (req, res) => {
    res.status(200).send(dadosEquipamentos);
});

api.post('/equipamentos', async (req, res) => {
    idEquipamento++;
    const equipamento = { id: idEquipamento, nome: req.body.nome };
    dadosEquipamentos.push(equipamento);
    notificaNodeRed('/equipamento-criado', equipamento);
    res.status(201).send({ code: 201, msg: "Equipamento criado com sucesso!", equipamento });
});

api.put('/equipamentos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = dadosEquipamentos.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).send({ code: 404, msg: "Equipamento nao encontrado" });

    dadosEquipamentos[index] = { id, ...req.body };
    notificaNodeRed('/equipamento-editado', { id, ...req.body });
    res.status(200).send({ code: 200, msg: "Equipamento atualizado com sucesso!" });
});

api.delete('/equipamentos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = dadosEquipamentos.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).send({ code: 404, msg: "Equipamento nao encontrado" });

    const equipamento = dadosEquipamentos[index];
    dadosEquipamentos.splice(index, 1);
    notificaNodeRed('/equipamento-deletado', { id, nome: equipamento.nome });
    res.status(200).send({ code: 200, msg: "Equipamento removido com sucesso!" });
});

// =====================
// DISPOSITIVOS (ESP32)
// =====================
// Cada dispositivo esta vinculado a um equipamento e possui status e controle de conexao
const dadosDispositivos = [];
let idDispositivo = 0;

api.get('/dispositivos', (req, res) => {
    res.status(200).send(dadosDispositivos);
});

api.get('/dispositivos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const dispositivo = dadosDispositivos.find(d => d.id === id);
    if (!dispositivo) return res.status(404).send({ code: 404, msg: "Dispositivo nao encontrado" });
    res.status(200).send(dispositivo);
});

api.post('/dispositivos', async (req, res) => {
    idDispositivo++;
    const dispositivo = {
        id: idDispositivo,
        equipamentoId: req.body.equipamentoId,
        statusDispositivo: req.body.statusDispositivo || "offline",
        conexaoAtiva: req.body.conexaoAtiva ?? false
    };
    dadosDispositivos.push(dispositivo);
    notificaNodeRed('/dispositivo-criado', dispositivo);
    res.status(201).send({ code: 201, msg: "Dispositivo criado com sucesso!", dispositivo });
});

api.put('/dispositivos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = dadosDispositivos.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).send({ code: 404, msg: "Dispositivo nao encontrado" });

    dadosDispositivos[index] = { ...dadosDispositivos[index], ...req.body, id };
    notificaNodeRed('/dispositivo-editado', dadosDispositivos[index]);
    res.status(200).send({ code: 200, msg: "Dispositivo atualizado com sucesso!" });
});

api.delete('/dispositivos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = dadosDispositivos.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).send({ code: 404, msg: "Dispositivo nao encontrado" });

    const dispositivo = dadosDispositivos[index];
    dadosDispositivos.splice(index, 1);
    notificaNodeRed('/dispositivo-deletado', { id, equipamentoId: dispositivo.equipamentoId });
    res.status(200).send({ code: 200, msg: "Dispositivo removido com sucesso!" });
});

// =====================
// COMANDOS: RELE E CONEXAO
// =====================

// Libera ou trava o rele de seguranca do dispositivo via frontend
api.post('/dispositivos/:id/rele', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = dadosDispositivos.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).send({ code: 404, msg: "Dispositivo nao encontrado" });

    const { trava_seguranca } = req.body;
    dadosDispositivos[index].trava_seguranca = trava_seguranca;

    const acao = trava_seguranca ? "travado" : "liberado";
    notificaNodeRed('/dispositivo-editado', { ...dadosDispositivos[index], comando: `rele_${acao}` });
    res.status(200).send({ code: 200, msg: `Rele ${acao} com sucesso!` });
});

// Libera ou bloqueia a conexao com o dispositivo via frontend
api.post('/dispositivos/:id/conexao', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = dadosDispositivos.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).send({ code: 404, msg: "Dispositivo nao encontrado" });

    const { conexaoAtiva } = req.body;
    dadosDispositivos[index].conexaoAtiva = conexaoAtiva;

    const acao = conexaoAtiva ? "liberada" : "bloqueada";
    notificaNodeRed('/dispositivo-editado', { ...dadosDispositivos[index], comando: `conexao_${acao}` });
    res.status(200).send({ code: 200, msg: `Conexao ${acao} com sucesso!` });
});

// =====================
// IOT — SENSORES (Node-RED / ESP32)
// =====================
const iot_data = [];
let idSensor = 0;

api.get('/iot', (req, res) => {
    res.status(200).send(iot_data);
});

api.get('/sensor/:id', (req, res) => {
    const sensor = iot_data.find(s => s.id === parseInt(req.params.id));
    if (!sensor) return res.status(404).send({ msg: "Sensor nao encontrado" });
    res.status(200).send(sensor);
});

// Recebe novos dados de sensor publicados pelo Node-RED
api.post('/newData', (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({ msg: "Dados nao encontrados" });
    }
    idSensor++;
    const { temperatura, pressao, umidade, sensor_presenca, trava_seguranca } = req.body;
    const newData = { id: idSensor, temperatura, pressao, umidade, sensor_presenca, trava_seguranca };
    iot_data.push(newData);
    return res.status(201).send({ msg: "Dados recebidos com sucesso!", newData });
});

// Cria um sensor manualmente via frontend
api.post('/sensor', (req, res) => {
    idSensor++;
    const { dispositivoId, temperatura, pressao, umidade, sensor_presenca, trava_seguranca } = req.body;
    const newData = { id: idSensor, dispositivoId: dispositivoId ?? null, temperatura: temperatura ?? 0, pressao: pressao ?? 0, umidade: umidade ?? 0, sensor_presenca: sensor_presenca ?? false, trava_seguranca: trava_seguranca ?? false };
    iot_data.push(newData);
    notificaNodeRed('/sensor-criado', newData);
    return res.status(201).send({ msg: "Sensor criado com sucesso!", newData });
});

// Atualiza os dados de um sensor existente (upsert)
api.put('/sensor/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = iot_data.findIndex(s => s.id === id);

    if (index === -1) {
        const newData = { id, ...req.body };
        iot_data.push(newData);
        notificaNodeRed('/sensor-criado', newData);
        return res.status(201).send({ msg: "Sensor criado automaticamente!", data: newData });
    }

    iot_data[index] = { id, ...req.body };
    notificaNodeRed('/sensor-editado', iot_data[index]);
    return res.status(200).send({ msg: "Dados do sensor atualizados!", data: iot_data[index] });
});

// Remove um sensor pelo id
api.delete('/sensor/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = iot_data.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).send({ msg: "Sensor nao encontrado" });

    iot_data.splice(index, 1);
    notificaNodeRed('/sensor-deletado', { id });
    return res.status(200).send({ msg: "Sensor removido com sucesso!" });
});

// =====================
// INICIAR SERVIDOR
// =====================
const porta = 8080;
api.listen(porta, () => console.log(`API rodando na porta ${porta}`));
