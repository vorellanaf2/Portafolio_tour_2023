export interface User{
    email: string,
    password: string,
    telefono: number,
    tipoUsuario: 'User' | 'Admin' | 'Empleado',
    username: string,
    direccion: string
}