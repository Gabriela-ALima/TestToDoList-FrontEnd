# 📝 Test To Do List Frontend

Este é o frontend da aplicação **Test To Do List**, um ecossistema completo para organização de atividades. O projeto oferece uma experiência de usuário (UX) fluida, com fluxos de autenticação robustos e gerenciamento completo de dados (CRUD) via integração com API.

---

## 🚀 Fluxo e Páginas da Aplicação

A aplicação está estruturada para guiar o usuário de forma intuitiva:

* **Página Inicial (Home)**: Landing page com apresentação do sistema e pontos de entrada para Login e Cadastro.
* **Cadastro**: Interface para registro de novos usuários. Após o sucesso, redireciona para o Login.
* **Login**: Autenticação segura que gera o token de acesso e redireciona o usuário para o painel de tarefas.
* **Lista de Tarefas**: Visualização centralizada de todas as tarefas cadastradas.
* **Editar Tarefas**: Área dedicada para atualização de títulos, descrições e status das atividades existentes.
* **Editar Usuário/Perfil**: Funcionalidade para que o usuário autenticado atualize suas informações cadastrais.

---

## 🛠️ Tecnologias Utilizadas

* **React + TypeScript**: Desenvolvimento de componentes reutilizáveis e tipagem estática.
* **Vite**: Ferramenta de build otimizada para performance em desenvolvimento.
* **Tailwind CSS**: Estilização baseada em classes utilitárias para design responsivo.
* **React Router Dom**: Gestão de rotas dinâmicas e proteção de navegação.
* **Axios**: Cliente HTTP para consumo da API Backend (endpoints de usuários e tarefas).
* **Context API**: Gerenciamento de estado global para persistência de tokens e dados do usuário logado.

---

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação localmente:

### 1. Instalação
Clone o repositório e instale as dependências:
```bash
# Clonar o repositório
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)

# Entrar na pasta
cd task-manager-frontend

# Instalar dependências
npm install

2. Configuração de API
Certifique-se de que o backend esteja acessível. No arquivo de serviços (src/services/Service.ts), verifique a URL base:

TypeScript
const api = axios.create({
  baseURL: '[https://sua-api-backend.render.com](https://sua-api-backend.render.com)'
});

3. Execução
Inicie o servidor de desenvolvimento:

Bash
npm run dev
Acesse: http://localhost:5173

📂 Estrutura de Pastas Principal
src/pages/: Implementação das telas (Home, Login, Cadastro, Tarefas, Edição).

src/components/: Componentes globais (Navbar, Footer, Botões Reutilizáveis).

src/contexts/: Provedor de autenticação (AuthContext).

src/models/: Interfaces TypeScript para tipagem de dados da API.

src/services/: Configuração e chamadas de API via Axios.

📄 Licença
Este projeto está sob a licença MIT.

Desenvolvido como parte do projeto de integração Fullstack.
