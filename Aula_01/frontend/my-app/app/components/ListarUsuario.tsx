export default function ListarUsuario() {
  return (
    <div className="w-[50vw] max-h-screen overflow-y-auto flex flex-col gap-4 bg-white text-black rounded-xl p-4">
      <h1>Todos os usuários</h1>
      <div className="w-[40vw] flex flex-col gap-4 bg-gray-300 border-2 border-gray-500 text-black rounded-xl p-4">
        <h1>Usuario 1</h1>
        <div className="flex">
          <p>Nome Completo</p>
          <p>Fulano de Tal da Silvassauro</p>
        </div>
        <div className="flex">
          <p>E-mail cadastrado</p>
          <p>email@email.com</p>
        </div>
      </div>
      <input
        type="text"
        placeholder="Nome completo"
        className="p-4 rounded-lg bg-gray-50 outline-1 outline-red-500"
      />
      <input
        type="password"
        placeholder="Senha"
        className="p-4 rounded-lg bg-gray-50 outline-1 outline-red-500"
      />
      <input
        type="submit"
        placeholder="Cadastrar"
        className="p-4 rounded-lg bg-green-400 hover:bg-green-500 tex-white"
      />
    </div>
  );
}
