export const config ={

    port:3001,

db:{
host: 'localhost',
user:'root',
password:'1123433815juansehr$',
database:'restaurante_db'

},

jwt: {
    secret:'Clave_super_secreta',
expiracion:'10h' as const
},

restaurante: {
nombre:'Restaurante',
hora_apertura:'10:00:00',
hora_cierre:'20:00:00',
duracion_reserva_min: 90,
max_personas_por_mesa:10

}


};