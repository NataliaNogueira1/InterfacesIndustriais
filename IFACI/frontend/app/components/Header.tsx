import Link from "next/link"

// Barra de navegação principal da aplicação
export default function Header() {
    return (
        <div className="w-screen px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">Painel de Controle</h1>
            <nav className="flex gap-2">
                <Link
                    href="/"
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium text-sm transition-colors"
                >
                    Usuários
                </Link>
                <Link
                    href="/equipamentos"
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium text-sm transition-colors"
                >
                    Equipamentos
                </Link>
            </nav>
        </div>
    )
}
