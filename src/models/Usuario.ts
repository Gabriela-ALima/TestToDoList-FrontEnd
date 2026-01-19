import type Tarefa from "./Tarefa" 

export default interface Usuario {
    id: number;
    name: string;      
    username: string;  
    email: string;     
    password: string;  
    tarefas?: Tarefa[];
}    