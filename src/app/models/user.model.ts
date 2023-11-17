export interface User{
    uid:string,
    email: string,
    password: string,
    telefono: number,
    tipoUsuario: 'User' | 'Admin' | 'Empleado',
    name: string,
    direccion: string
}