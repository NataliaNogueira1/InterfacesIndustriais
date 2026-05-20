"use client"
import { useState, useEffect, useRef, ChangeEvent, useImperativeHandle, forwardRef } from "react"

export interface ListarEquipamentosRef {
    refresh: () => void
}

type Dispositivo = {
    id: number
    equipamentoId: number
    statusDispositivo: string
    conexaoAtiva: boolean
}

type SensorIoT = {
    id: number
    dispositivoId: number | null
    temperatura: number
    pressao: number
    umidade: number
    sensor_presenca: boolean
    trava_seguranca: boolean
}

const ListarEquipamentos = forwardRef<ListarEquipamentosRef>(function ListarEquipamentos(_, ref) {

    // === EQUIPAMENTOS ===
    const [equipamentos, setEquipamentos] = useState([{ id: 0, nome: "" }])
    const [novoEquipamento, setNovoEquipamento] = useState({ nome: "" })
    const [modalEditarEquip, setModalEditarEquip] = useState(false)
    const equipamentoId = useRef(0)

    const pegaEquipamentosBackend = async () => {
        try {
            const resposta = await fetch("http://localhost:8080/equipamentos")
            const json = await resposta.json()
            setEquipamentos(json)
        } catch (erro) {
            console.log(erro)
        }
    }

    useImperativeHandle(ref, () => ({
        refresh: pegaEquipamentosBackend
    }))

    const deletaEquipamento = async (id: number) => {
        try {
            const resposta = await fetch(`http://localhost:8080/equipamentos/${id}`, { method: "DELETE" })
            const json = await resposta.json()
            alert(json.msg)
            pegaEquipamentosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    const editaEquipamento = async (id: number) => {
        try {
            const resposta = await fetch(`http://localhost:8080/equipamentos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoEquipamento)
            })
            const json = await resposta.json()
            alert(json.msg)
            setNovoEquipamento({ nome: "" })
            pegaEquipamentosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    // === DISPOSITIVOS ===
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([])
    const [novoDispositivo, setNovoDispositivo] = useState({ equipamentoId: 0, statusDispositivo: "offline", conexaoAtiva: false })
    const [editDispositivo, setEditDispositivo] = useState({ statusDispositivo: "offline", conexaoAtiva: false })
    const [modalCriarDisp, setModalCriarDisp] = useState(false)
    const [modalEditarDisp, setModalEditarDisp] = useState(false)
    const dispositivoId = useRef(0)
    const equipIdDisp = useRef(0)

    const pegaDispositivosBackend = async () => {
        try {
            const resposta = await fetch("http://localhost:8080/dispositivos")
            const json = await resposta.json()
            setDispositivos(json)
        } catch (erro) {
            console.log(erro)
        }
    }

    const criaDispositivo = async () => {
        try {
            const resposta = await fetch("http://localhost:8080/dispositivos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoDispositivo)
            })
            const json = await resposta.json()
            alert(json.msg)
            setNovoDispositivo({ equipamentoId: 0, statusDispositivo: "offline", conexaoAtiva: false })
            setModalCriarDisp(false)
            pegaDispositivosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    const editaDispositivo = async (id: number) => {
        try {
            const resposta = await fetch(`http://localhost:8080/dispositivos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editDispositivo)
            })
            const json = await resposta.json()
            alert(json.msg)
            setModalEditarDisp(false)
            pegaDispositivosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    const deletaDispositivo = async (id: number) => {
        try {
            const resposta = await fetch(`http://localhost:8080/dispositivos/${id}`, { method: "DELETE" })
            const json = await resposta.json()
            alert(json.msg)
            pegaDispositivosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    // === COMANDOS: RELE E CONEXAO ===
    const comandoRele = async (id: number, travar: boolean) => {
        try {
            const resposta = await fetch(`http://localhost:8080/dispositivos/${id}/rele`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trava_seguranca: travar })
            })
            const json = await resposta.json()
            alert(json.msg)
            pegaDispositivosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    const comandoConexao = async (id: number, ativar: boolean) => {
        try {
            const resposta = await fetch(`http://localhost:8080/dispositivos/${id}/conexao`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conexaoAtiva: ativar })
            })
            const json = await resposta.json()
            alert(json.msg)
            pegaDispositivosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    // === SENSORES IoT — agora filtrados por dispositivoId ===
    const [sensoresIoT, setSensoresIoT] = useState<SensorIoT[]>([])
    const [novoSensor, setNovoSensor] = useState({ dispositivoId: 0, temperatura: 0, pressao: 0, umidade: 0, sensor_presenca: false, trava_seguranca: false })
    const [editSensor, setEditSensor] = useState({ temperatura: 0, pressao: 0, umidade: 0, sensor_presenca: false, trava_seguranca: false })
    const [modalCriarSensor, setModalCriarSensor] = useState(false)
    const [modalEditarSensor, setModalEditarSensor] = useState(false)
    const sensorId = useRef(0)
    const dispIdSensor = useRef(0)

    const pegaSensoresIoT = async () => {
        try {
            const resposta = await fetch("http://localhost:8080/iot")
            const json = await resposta.json()
            setSensoresIoT(json)
        } catch (erro) {
            console.log(erro)
        }
    }

    const criaSensor = async () => {
        try {
            const resposta = await fetch("http://localhost:8080/sensor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoSensor)
            })
            const json = await resposta.json()
            alert(json.msg)
            setNovoSensor({ dispositivoId: 0, temperatura: 0, pressao: 0, umidade: 0, sensor_presenca: false, trava_seguranca: false })
            setModalCriarSensor(false)
            pegaSensoresIoT()
        } catch (erro) {
            console.log(erro)
        }
    }

    const editaSensor = async (id: number) => {
        try {
            const resposta = await fetch(`http://localhost:8080/sensor/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editSensor)
            })
            const json = await resposta.json()
            alert(json.msg)
            setModalEditarSensor(false)
            pegaSensoresIoT()
        } catch (erro) {
            console.log(erro)
        }
    }

    const deletaSensor = async (id: number) => {
        try {
            const resposta = await fetch(`http://localhost:8080/sensor/${id}`, { method: "DELETE" })
            const json = await resposta.json()
            alert(json.msg)
            pegaSensoresIoT()
        } catch (erro) {
            console.log(erro)
        }
    }

    useEffect(() => {
        pegaEquipamentosBackend()
        pegaDispositivosBackend()
        pegaSensoresIoT()
        const intervalo = setInterval(() => {
            pegaSensoresIoT()
            pegaDispositivosBackend()
        }, 5000)
        return () => clearInterval(intervalo)
    }, [])

    return (
        <div className="w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-black rounded-xl flex flex-col gap-4 p-4">
            <h2 className="text-xl font-semibold">Lista de Equipamentos</h2>

            {equipamentos.map((equip, idx) => {
                const dispositivosDoEquip = dispositivos.filter(d => d.equipamentoId === equip.id)

                return (
                    <div key={idx} className="bg-slate-100 border-2 border-slate-400 rounded-lg p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Equipamento {equip.id}</h2>
                                <p>{equip.nome}</p>
                            </div>
                            <div className="flex gap-2">
                                <input type="button" value="Editar"
                                    onClick={() => { equipamentoId.current = equip.id; setModalEditarEquip(true) }}
                                    className="rounded-lg px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                                />
                                <input type="button" value="Deletar"
                                    onClick={() => deletaEquipamento(equip.id)}
                                    className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Dispositivos vinculados a este equipamento */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">Dispositivos ({dispositivosDoEquip.length})</p>
                                <input type="button" value="+ Dispositivo"
                                    onClick={() => {
                                        setNovoDispositivo({ equipamentoId: equip.id, statusDispositivo: "offline", conexaoAtiva: false })
                                        equipIdDisp.current = equip.id
                                        setModalCriarDisp(true)
                                    }}
                                    className="rounded-lg px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs cursor-pointer"
                                />
                            </div>

                            {dispositivosDoEquip.length === 0 && (
                                <p className="text-xs text-gray-500">Nenhum dispositivo vinculado.</p>
                            )}

                            {dispositivosDoEquip.map((disp) => {
                                // Filtra todos os sensores vinculados a este dispositivo
                                const sensoresDoDisp = sensoresIoT.filter(s => s.dispositivoId === disp.id)

                                return (
                                    <div key={disp.id} className="bg-white border border-slate-300 rounded-lg p-3 flex flex-col gap-3">

                                        {/* ID e status do dispositivo */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold">Dispositivo ID: {disp.id}</p>
                                                <p className="text-xs text-gray-500">
                                                    Status: <span className={disp.statusDispositivo === "online" ? "text-emerald-600 font-semibold" : "text-gray-400"}>
                                                        {disp.statusDispositivo}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Conexao: <span className={disp.conexaoAtiva ? "text-blue-600 font-semibold" : "text-gray-400"}>
                                                        {disp.conexaoAtiva ? "Ativa" : "Bloqueada"}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <input type="button" value="Editar"
                                                    onClick={() => {
                                                        dispositivoId.current = disp.id
                                                        setEditDispositivo({ statusDispositivo: disp.statusDispositivo, conexaoAtiva: disp.conexaoAtiva })
                                                        setModalEditarDisp(true)
                                                    }}
                                                    className="rounded-lg px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs cursor-pointer"
                                                />
                                                <input type="button" value="Deletar"
                                                    onClick={() => deletaDispositivo(disp.id)}
                                                    className="rounded-lg px-3 py-1 bg-red-400 hover:bg-red-500 text-white text-xs cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Sensores IoT — multiplos por dispositivo */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-semibold text-gray-600">Sensores IoT ({sensoresDoDisp.length})</p>
                                                <input type="button" value="+ Sensor"
                                                    onClick={() => {
                                                        dispIdSensor.current = disp.id
                                                        setNovoSensor({ dispositivoId: disp.id, temperatura: 0, pressao: 0, umidade: 0, sensor_presenca: false, trava_seguranca: false })
                                                        setModalCriarSensor(true)
                                                    }}
                                                    className="rounded-lg px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs cursor-pointer"
                                                />
                                            </div>

                                            {sensoresDoDisp.length === 0 && (
                                                <p className="text-xs text-gray-400">Aguardando dados do sensor IoT...</p>
                                            )}

                                            {sensoresDoDisp.map((sensor) => (
                                                <div key={sensor.id} className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex flex-col gap-1 text-sm">
                                                    <p className="font-medium text-amber-700 text-xs uppercase tracking-wide">Sensor #{sensor.id} (Node-RED)</p>
                                                    <p>Temperatura: <span className="font-medium">{sensor.temperatura?.toFixed(2)} C</span></p>
                                                    <p>Pressao: <span className="font-medium">{sensor.pressao?.toFixed(4)} hPa</span></p>
                                                    <p>Umidade: <span className="font-medium">{sensor.umidade?.toFixed(4)} %</span></p>
                                                    <p>Presenca: <span className={sensor.sensor_presenca ? "text-emerald-600 font-semibold" : "text-gray-500"}>{sensor.sensor_presenca ? "Detectada" : "Nao detectada"}</span></p>
                                                    <p>Trava: <span className={sensor.trava_seguranca ? "text-red-500 font-semibold" : "text-emerald-600 font-semibold"}>{sensor.trava_seguranca ? "Ativada" : "Desativada"}</span></p>
                                                    <div className="flex gap-2 mt-1">
                                                        <input type="button" value="Editar"
                                                            onClick={() => {
                                                                sensorId.current = sensor.id
                                                                setEditSensor({ temperatura: sensor.temperatura, pressao: sensor.pressao, umidade: sensor.umidade, sensor_presenca: sensor.sensor_presenca, trava_seguranca: sensor.trava_seguranca })
                                                                setModalEditarSensor(true)
                                                            }}
                                                            className="rounded-lg px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs cursor-pointer"
                                                        />
                                                        <input type="button" value="Deletar"
                                                            onClick={() => deletaSensor(sensor.id)}
                                                            className="rounded-lg px-3 py-1 bg-red-400 hover:bg-red-500 text-white text-xs cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Comandos: rele e conexao */}
                                        <div className="flex flex-col gap-2">
                                            <p className="text-xs font-semibold text-gray-600">Comandos</p>
                                            <div className="flex flex-wrap gap-2">
                                                <input type="button" value="Liberar Rele"
                                                    onClick={() => comandoRele(disp.id, false)}
                                                    className="rounded-lg px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs cursor-pointer"
                                                />
                                                <input type="button" value="Travar Rele"
                                                    onClick={() => comandoRele(disp.id, true)}
                                                    className="rounded-lg px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs cursor-pointer"
                                                />
                                                <input type="button" value="Liberar Conexao"
                                                    onClick={() => comandoConexao(disp.id, true)}
                                                    className="rounded-lg px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs cursor-pointer"
                                                />
                                                <input type="button" value="Bloquear Conexao"
                                                    onClick={() => comandoConexao(disp.id, false)}
                                                    className="rounded-lg px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}

            {/* Modal editar equipamento */}
            {modalEditarEquip &&
                <div className="w-screen h-screen inset-0 absolute bg-gray-700/50 flex justify-center items-center">
                    <div className="w-[50vw] h-fit rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-8">
                        <h2 className="text-xl font-semibold">Editar Equipamento {equipamentoId.current}</h2>
                        <div className="flex flex-col gap-4">
                            <input type="text" placeholder="Novo Nome" value={novoEquipamento.nome}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNovoEquipamento({ nome: e.target.value })}
                                className="p-4 rounded-lg outline-2 outline-blue-500"
                            />
                            <div className="flex gap-8 justify-end w-full">
                                <input type="button" value="Confirmar"
                                    onClick={() => { editaEquipamento(equipamentoId.current); setModalEditarEquip(false) }}
                                    className="rounded-lg px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                                />
                                <input type="button" value="Cancelar"
                                    onClick={() => setModalEditarEquip(false)}
                                    className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Modal criar dispositivo */}
            {modalCriarDisp &&
                <div className="w-screen h-screen inset-0 absolute bg-gray-700/50 flex justify-center items-center">
                    <div className="w-[50vw] h-fit rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-8">
                        <h2 className="text-xl font-semibold">Novo Dispositivo (Equipamento {equipIdDisp.current})</h2>
                        <div className="flex flex-col gap-4">
                            <label className="text-sm text-gray-600">Status</label>
                            <select
                                value={novoDispositivo.statusDispositivo}
                                onChange={(e) => setNovoDispositivo({ ...novoDispositivo, statusDispositivo: e.target.value })}
                                className="p-3 rounded-lg border border-gray-300 outline-2 outline-blue-500"
                            >
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={novoDispositivo.conexaoAtiva}
                                    onChange={(e) => setNovoDispositivo({ ...novoDispositivo, conexaoAtiva: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Conexao ativa
                            </label>
                            <div className="flex gap-8 justify-end w-full">
                                <input type="button" value="Criar"
                                    onClick={criaDispositivo}
                                    className="rounded-lg px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                                />
                                <input type="button" value="Cancelar"
                                    onClick={() => setModalCriarDisp(false)}
                                    className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Modal editar dispositivo */}
            {modalEditarDisp &&
                <div className="w-screen h-screen inset-0 absolute bg-gray-700/50 flex justify-center items-center">
                    <div className="w-[50vw] h-fit rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-8">
                        <h2 className="text-xl font-semibold">Editar Dispositivo {dispositivoId.current}</h2>
                        <div className="flex flex-col gap-4">
                            <label className="text-sm text-gray-600">Status</label>
                            <select
                                value={editDispositivo.statusDispositivo}
                                onChange={(e) => setEditDispositivo({ ...editDispositivo, statusDispositivo: e.target.value })}
                                className="p-3 rounded-lg border border-gray-300 outline-2 outline-blue-500"
                            >
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={editDispositivo.conexaoAtiva}
                                    onChange={(e) => setEditDispositivo({ ...editDispositivo, conexaoAtiva: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Conexao ativa
                            </label>
                            <div className="flex gap-8 justify-end w-full">
                                <input type="button" value="Confirmar"
                                    onClick={() => editaDispositivo(dispositivoId.current)}
                                    className="rounded-lg px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                                />
                                <input type="button" value="Cancelar"
                                    onClick={() => setModalEditarDisp(false)}
                                    className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Modal criar sensor */}
            {modalCriarSensor &&
                <div className="w-screen h-screen inset-0 absolute bg-gray-700/50 flex justify-center items-center">
                    <div className="w-[50vw] h-fit rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-6">
                        <h2 className="text-xl font-semibold">Novo Sensor (Dispositivo {dispIdSensor.current})</h2>
                        <div className="flex flex-col gap-3">
                            <input type="number" placeholder="Temperatura (C)" value={novoSensor.temperatura}
                                onChange={(e) => setNovoSensor({ ...novoSensor, temperatura: parseFloat(e.target.value) })}
                                className="p-3 rounded-lg outline-2 outline-amber-400"
                            />
                            <input type="number" placeholder="Pressao (hPa)" value={novoSensor.pressao}
                                onChange={(e) => setNovoSensor({ ...novoSensor, pressao: parseFloat(e.target.value) })}
                                className="p-3 rounded-lg outline-2 outline-amber-400"
                            />
                            <input type="number" placeholder="Umidade (%)" value={novoSensor.umidade}
                                onChange={(e) => setNovoSensor({ ...novoSensor, umidade: parseFloat(e.target.value) })}
                                className="p-3 rounded-lg outline-2 outline-amber-400"
                            />
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={novoSensor.sensor_presenca}
                                    onChange={(e) => setNovoSensor({ ...novoSensor, sensor_presenca: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Presenca detectada
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={novoSensor.trava_seguranca}
                                    onChange={(e) => setNovoSensor({ ...novoSensor, trava_seguranca: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Trava de seguranca ativa
                            </label>
                        </div>
                        <div className="flex gap-8 justify-end w-full">
                            <input type="button" value="Criar"
                                onClick={criaSensor}
                                className="rounded-lg px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                            />
                            <input type="button" value="Cancelar"
                                onClick={() => setModalCriarSensor(false)}
                                className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            }

            {/* Modal editar sensor */}
            {modalEditarSensor &&
                <div className="w-screen h-screen inset-0 absolute bg-gray-700/50 flex justify-center items-center">
                    <div className="w-[50vw] h-fit rounded-2xl shadow-lg bg-white flex flex-col px-6 py-4 gap-6">
                        <h2 className="text-xl font-semibold">Editar Sensor {sensorId.current}</h2>
                        <div className="flex flex-col gap-3">
                            <input type="number" placeholder="Temperatura (C)" value={editSensor.temperatura}
                                onChange={(e) => setEditSensor({ ...editSensor, temperatura: parseFloat(e.target.value) })}
                                className="p-3 rounded-lg outline-2 outline-amber-400"
                            />
                            <input type="number" placeholder="Pressao (hPa)" value={editSensor.pressao}
                                onChange={(e) => setEditSensor({ ...editSensor, pressao: parseFloat(e.target.value) })}
                                className="p-3 rounded-lg outline-2 outline-amber-400"
                            />
                            <input type="number" placeholder="Umidade (%)" value={editSensor.umidade}
                                onChange={(e) => setEditSensor({ ...editSensor, umidade: parseFloat(e.target.value) })}
                                className="p-3 rounded-lg outline-2 outline-amber-400"
                            />
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={editSensor.sensor_presenca}
                                    onChange={(e) => setEditSensor({ ...editSensor, sensor_presenca: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Presenca detectada
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={editSensor.trava_seguranca}
                                    onChange={(e) => setEditSensor({ ...editSensor, trava_seguranca: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Trava de seguranca ativa
                            </label>
                        </div>
                        <div className="flex gap-8 justify-end w-full">
                            <input type="button" value="Confirmar"
                                onClick={() => editaSensor(sensorId.current)}
                                className="rounded-lg px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                            />
                            <input type="button" value="Cancelar"
                                onClick={() => setModalEditarSensor(false)}
                                className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
})

export default ListarEquipamentos
