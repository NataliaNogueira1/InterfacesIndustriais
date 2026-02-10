export default function CriarUsuario() {
  return (
    <div className="w-[50vw] flex flex-col gap-4 bg-white text-black rounded-xl p-4">
      <h1>Criar usuário</h1>
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
