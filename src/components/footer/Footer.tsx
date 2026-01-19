function Footer() {

  // Pega o ano atual automaticamente para o Copyright
  const data = new Date().getFullYear();

  return (
    <>
      <footer className="flex justify-center bg-indigo-900 text-white border-t border-indigo-800">
        <div className="container flex flex-col items-center py-6">
          
          {/* Título ou Nome do App */}
          <p className='text-xl font-bold'>
            TaskIt | Gerenciador de Tarefas
          </p>

          {/* Informação Técnica (Dá um ar profissional) */}
          <p className='text-sm mt-1 text-indigo-200'>
            Conectado à API Render & Banco de Dados PostgreSQL
          </p>

          {/* Copyright e Versão */}
          <div className='flex gap-2 mt-4 text-xs text-indigo-300'>
            <span>Copyright: {data}</span>
            <span>|</span>
            <span>Versão 1.0.0</span>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;