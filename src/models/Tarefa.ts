import type Usuario from "./Usuario";

export default interface Tarefa {
    id: number;
    titulo: string;      
    descricao: string;   
    status: boolean;     
    usuario?: Usuario | null; 
}