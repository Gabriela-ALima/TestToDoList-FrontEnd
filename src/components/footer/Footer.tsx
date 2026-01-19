function Footer() {

  
  const data = new Date().getFullYear();

  return (
    <>
      <footer className="flex justify-center bg-indigo-900 text-white border-t border-indigo-800">
        <div className="container flex flex-col items-center py-6">
          
          
          <p className='text-xl font-bold'>
            TaskIt | Gerenciador de Tarefas
          </p>

          
          <p className='text-sm mt-1 text-indigo-200'>
            Conectado à API Render & Banco de Dados PostgreSQL
          </p>

          
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