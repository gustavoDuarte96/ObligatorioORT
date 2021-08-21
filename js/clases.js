/*Gastón González y Gustavo Duarte*/

class Donante{
    constructor(nombre, direccion, telefono){
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.donacionesRealizadas = 0;
    }
    toString(){
        return this.nombre + " " + this.direccion + " " + this.telefono;
    }
}
//Clase Donante

class Donacion {
    constructor(donante,modo,monto,comentarios, nombre){
        this.nombre = nombre;
        this.donante = donante;
        this.modo = modo;
        this.monto = monto;
        this.comentarios = comentarios;
    }
    toString(){
        return this.donante +" "+this.modo+" "+this.monto+" "+this.comentarios;
    }
}
//Clase Donación

class Sistema {
    constructor(){
        this.listaDonantes = [];
        this.listaDonaciones = [];
    }
    agregarDonante(donante){                    //Agrega los donantes registrados al sistema, en la lista de donantes
        this.listaDonantes.push(donante);
    }
    agregarDonacion(donacion){                  //Agrega las donaciones registrados al sistema, en la lista de
        this.listaDonaciones.push(donacion);    //donaciones
    }
    darDonantes(){                              //Retorna la lista con los objetos de donantes
        return this.listaDonantes;
    }
    darDonaciones(){                            //Retorna la lista con los objetos de donaciones
        return this.listaDonaciones;
    }
    ordenarDecreciente(){                       //Ordena la lista de donaciones de forma decreciente con respecto
        let lista = this.listaDonaciones        //al monto
        lista.sort(function (a, b){
            if(a.monto < b.monto){
                return 1;
            }
            if(a.monto > b.monto){
                return -1;
            }
            return 0;
        });
    }
    ordenarCreciente(){                         //Ordena la lista de doanciones de forma creciente alfabéticamente
        let lista = this.listaDonaciones        //con respecto a los nombres de los donantes
        lista.sort(function (a, b){
            if(a.nombre.toLowerCase() > b.nombre.toLowerCase()){
                return 1;
            }
            if(a.nombre.toLowerCase() < b.nombre.toLowerCase()){
                return -1;
            }
            return 0;
        });
    }
    totalDonaciones(){                          //Retorna la totabilización de las donaciones realizadas
        let suma = 0;
        let lista = this.listaDonaciones;
        for(let donaciones of lista){
            suma+= donaciones.monto;
        }
        return suma;
    }
    promedio(){                                 //Retorna el promedio de todas las donaciones realizadas
        let suma = 0;
        let lista = this.listaDonaciones;
        for(let donaciones of lista){
            suma+= donaciones.monto;
        }
        return Math.round(suma/lista.length);
    }
    cantidadDonaciones(){                       //Retorna cuantos elementos hay en la lista de Donaciones
        let lista = this.listaDonaciones;
        return lista.length;
    }
    mayorDonacionn(){                           //Retorna cual fue la donación de mayor monto realizada
        let mayor = 0;
        let lista = this.listaDonaciones;
        for(let donaciones of lista){
            if(donaciones.monto > mayor){
                mayor=donaciones.monto;
            }
        }
        return mayor;
    } 
    mayoresDonantes(){                          //Retorna cual o cuales son los que mas veces donaron 
        let mayoresDonantes = [];
        let cantidadDonacionesMaxima = 0;
        let lista = this.listaDonantes;
        for(let donantes of lista){
            if(donantes.donacionesRealizadas > cantidadDonacionesMaxima){
                mayoresDonantes = [];
                mayoresDonantes.push(donantes.nombre);
                cantidadDonacionesMaxima = donantes.donacionesRealizadas;
            }else{
                if(donantes.donacionesRealizadas == cantidadDonacionesMaxima){
                    mayoresDonantes.push(donantes.nombre);
                }
            }
        }
        return mayoresDonantes;
    }
}
//Clase Sistema