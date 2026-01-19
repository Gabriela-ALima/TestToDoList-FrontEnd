import axios from "axios";

const api = axios.create({
    baseURL: 'https://testtodolist-c1rc.onrender.com'
})

// Cadastro de usuário (Rota pública - sem token)
export const cadastrarUsuario = async(url: string, dados: object, setDados: Function) => {
    const resposta = await api.post(url, dados)
    setDados(resposta.data)
}

// Login (Rota pública - sem token)
export const login = async(url: string, dados: object, setDados: Function) => {
    const resposta = await api.post(url, dados)
    setDados(resposta.data)
}

// Buscar dados (Privada - requer token no header)
export const buscar = async(url: string, setDados: Function, header: object) => {
    const resposta = await api.get(url, header)
    setDados(resposta.data)
}

// Cadastrar itens/temas (Privada - requer token no header)
export const cadastrar = async(url: string, dados: object, setDados: Function, header: object) => {
    const resposta = await api.post(url, dados, header)
    setDados(resposta.data)
}

// --- NOVAS FUNÇÕES ABAIXO ---

// Atualizar dados (Privada - utiliza o método PUT)
export const atualizar = async(url: string, dados: object, setDados: Function, header: object) => {
    const resposta = await api.put(url, dados, header)
    setDados(resposta.data)
}

// Deletar dados (Privada - utiliza o método DELETE)
export const deletar = async(url: string, header: object) => {
    await api.delete(url, header)
}