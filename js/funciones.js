/*Gastón González y Gustavo Duarte*/
window.addEventListener("load", inicio);
let sistema = new Sistema();
window.addEventListener("resize", drawChart);

function inicio(){
	google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
	document.getElementById("idBotonAgregarDonante").addEventListener("click", agregarDonante);
    document.getElementById("idBotonAgregarDonacion").addEventListener("click", agregarDonacion);
	document.getElementById("Decreciente").addEventListener("click", ordenarMontoDecreciente);
	document.getElementById("Creciente").addEventListener("click", ordenarNombreCreciente);
	document.getElementById("idResaltar").addEventListener("click", resalte);
	document.getElementById("idDeMonto").addEventListener("keyup", resalte);
	document.getElementById("idDeMonto").addEventListener("click", resalte);
    sinDatos();
}
function sinDatos(){													//Cuando no se hayan registrado donaciones
	let lista1 = sistema.listaDonantes;									//se indicaran en todas las secciones de
	let lista2 = sistema.listaDonaciones;								//datos "SIN DATOS"
	let sinDatos = "SIN DATOS";
	if(lista1.length == 0 && lista2.length == 0){
		let indicador1 = document.getElementById("totalGeneral");
		indicador1.innerHTML = sinDatos;
		let indicador2 = document.getElementById("mayorDonacion");
		indicador2.innerHTML = sinDatos;
		let variante1 = document.getElementById("cantidadDonaciones");
		variante1.innerHTML = "Cantidad de donaciones: " + sinDatos;
		let variante2 = document.getElementById("promedioDonaciones");
		variante2.innerHTML = "Promedio por donación: " + sinDatos;
		let variante3 = document.getElementById("mayorDonante");
		variante3.innerHTML = "Donante que mas veces donó: " + sinDatos;
		let tabla = document.getElementById("tablaBody");
		tabla.innerHTML = "";	
		let fila = tabla.insertRow();
		let celda1 = fila.insertCell();
		let celda2 = fila.insertCell();
		let celda3 = fila.insertCell();
		let celda4 = fila.insertCell();
		celda1.innerHTML = sinDatos;
		celda2.innerHTML = sinDatos;
		celda3.innerHTML = sinDatos;
		celda4.innerHTML = sinDatos;
	}
}
function agregarDonante(){														//Ingresa el donante al sistema, también
	let formu = document.getElementById("idFormularioDonante");					//impide el ingreso de un usuario ya
	let usuarios = sistema.listaDonantes;										//existente
	if(formu.reportValidity()){
		let repetido = true;
		let nombre = document.getElementById("idNombre").value;
		if(usuarios.length == 0){
			let direccion = document.getElementById("idDireccion").value;
			let telefono = document.getElementById("idTelefono").value;
			sistema.agregarDonante(new Donante(nombre, direccion, telefono));
			cargarDonante(nombre);
			formu.reset();
		}else{
			for(let elemen of usuarios){
				if(nombre.toLowerCase() == elemen.nombre.toLowerCase()){
					repetido = false;
				}
			}
			if(repetido){
				let direccion = document.getElementById("idDireccion").value;
				let telefono = document.getElementById("idTelefono").value;
				sistema.agregarDonante(new Donante(nombre, direccion, telefono));
				cargarDonante(nombre);
				formu.reset();
				return;
			}else{
				alert("Éste usuario ya fue ingresado al sistema");
				formu.reset();
				return;
			}
		}
	}
}
function cargarDonante(pal){									//Guarda el nombre del donante registrado en el sistema
	let donante = document.getElementById("combo");				//en el comboBox del formulario de donaciones
	let node = document.createElement("option");				
	let textNode = document.createTextNode(pal);
	node.appendChild(textNode);
	donante.appendChild(node);
}
function agregarDonacion(){											//Ingresa la donación realizada al sistema, carga
	let formu = document.getElementById("idFormularioDonacion");	//dicha donación en la tabla y actualiza los datos
	if(formu.reportValidity()){										//de la gráfica
		let donante = document.getElementById("combo").value;
		let datos = sistema.darDonantes();
		for(let element of datos){
			if(donante == element.nombre){
				textDonante = element.nombre + " (" + element.direccion + ", " +element.telefono + ")";
				nombre = element.nombre;
				element.donacionesRealizadas++;
			}
		}
		let textTabla = textDonante;
		let modo = document.getElementById("idModo").value;
		let monto = parseInt(document.getElementById("idMonto").value);
        let comentario = document.getElementById("idComentarios").value;
		if(comentario.length == 0){
			comentario = "SIN COMENTARIOS";
		}
		sistema.agregarDonacion(new Donacion(textTabla, modo, monto, comentario, nombre));
		if(document.getElementById("Decreciente").checked){
			sistema.ordenarDecreciente();
		}
		if(document.getElementById("Creciente").checked){
			sistema.ordenarCreciente();
		}
		cargarTabla();
		actualizarDatos();
		actualizarDatosGrafica()
		formu.reset();
	}
}
function cargarTabla(){										//Carga los datos ingresados de la donación en la tabla,
	let tabla = document.getElementById("tablaBody");		//y resalta las celdas con monto indicado por el usuario 
	tabla.innerHTML = "";									//los montos mayores a 1000 se le pondra color rojo
	let datos = sistema.darDonaciones();					//y los inferiores a dicho monto en verde
	for(let elemento of datos){
		let fila = tabla.insertRow();
		let celda1 = fila.insertCell();
		let celda2 = fila.insertCell();
		let celda3 = fila.insertCell();
		let celda4 = fila.insertCell();
		if(elemento.monto >= 1000){
			celda3.style.color = "red";
		}else{
			celda3.style.color = "green";
		}
		if(document.getElementById("idResaltar").checked){
			if(elemento.monto == resaltarFila()){
				celda1.style.backgroundColor = "yellow";
				celda2.style.backgroundColor = "yellow";
				celda3.style.backgroundColor = "yellow";
				celda4.style.backgroundColor = "yellow";
			}
		}else{
			celda1.style.backgroundColor = "none";
			celda2.style.backgroundColor = "none";
			celda3.style.backgroundColor = "none";
			celda4.style.backgroundColor = "none";
		}
		celda1.innerHTML = elemento.donante;
		celda2.innerHTML = elemento.modo;
		celda3.innerHTML = elemento.monto;
		celda4.innerHTML = elemento.comentarios;
	}
}
function actualizarDatos(){										//Esta función actualiza todos los datos que son variados
	totalDonacion();											//en cada ingreso de donaciones al sistema
	mayorDonacione();
	cantidadDeDonaciones();
	promedioDeDonaciones();
	mayoresDonanteDelSistema();
}
function totalDonacion(){										//Es una función que es llamada cuando hay datos
	let indicador = document.getElementById("totalGeneral");	//para actualizar los datos en la id seleccionada
	indicador.innerHTML = "";
	indicador.innerHTML = "$ " + sistema.totalDonaciones();
}
function mayorDonacione(){										//Es una función que es llamada cuando hay datos
	let indicador = document.getElementById("mayorDonacion");	//para actualizar los datos en la id seleccionada
	indicador.innerHTML = "";
	indicador.innerHTML = "$ " + sistema.mayorDonacionn();
}
function cantidadDeDonaciones(){									//Es una función que es llamada cuando hay datos
	let variante = document.getElementById("cantidadDonaciones");	//para actualizar los datos en la id seleccionada
	variante.innerHTML = "";
	variante.innerHTML = "Cantidad de donaciones: " + sistema.cantidadDonaciones();
}
function promedioDeDonaciones(){									//Es una función que es llamada cuando hay datos
	let variante = document.getElementById("promedioDonaciones");	//para actualizar los datos en la id seleccionada
	variante.innerHTML = "";
	variante.innerHTML = "Promedio por donación: " + sistema.promedio();
}
function mayoresDonanteDelSistema(){								//Es una función que es llamada cuando hay datos
	let variante = document.getElementById("mayorDonante");			//para actualizar los datos en la id seleccionada
	let lista = document.getElementById("listaDonantesMaximos");	//y comprueba si es uno o mas los que comparten el podio
	variante.innerHTML = "";										
	if(sistema.mayoresDonantes().length < 2){
		variante.innerHTML = "Donante que mas veces donó: " + sistema.mayoresDonantes()[0];
		lista.innerHTML = "";
	}else{
		variante.innerHTML = "Los dontantes que mas veces donaron:"
		cargarLista(sistema.mayoresDonantes());
	}
}
function cargarLista(lista){												//Función que es llamada cuando el podio
	let listaDesordenada = document.getElementById("listaDonantesMaximos");	//del mayor donante es compartido
	listaDesordenada.innerHTML = "";										//entonces crea una lista para los mismos
	for(let elem of lista){
		let nodo = document.createElement("li");
		nodo.style.listStyle = "none";
		let nodoText = document.createTextNode(elem);
		nodo.appendChild(nodoText);
		listaDesordenada.appendChild(nodo);
	} 
}
function ordenarMontoDecreciente(){								//Es llamado cuando el usuario elige ordenar la tabla
	sistema.ordenarDecreciente();								//de forma decreciente con respecto a los montos
	actualizar();
}
function ordenarNombreCreciente(){								//Es llamado cuando el usuario elige ordenar la tabla
	sistema.ordenarCreciente();									//de forma creciente con respecto al orden alfabético
	actualizar();												//de los nomrbes de donantes
}
function resaltarFila(){										//Obtiene el valor del monto a resaltar
	let monto = document.getElementById("idDeMonto").value;
	return monto;
}
function resalte(){												//Actualiza la tabla para ser resaltada
	resaltarFila();
	actualizar();	
}
function actualizar(){											//Función para tener actualizada la tabla en todo momento
	cargarTabla();
	sinDatos();
}
function actualizarDatosGrafica(){								//Actualiza los datos para la gráfica
	let datos = sistema.darDonaciones();
	let efectivo = 0;
	let transferencia = 0;
	let canje = 0;
	let mercaderia = 0;
	let cheque = 0;
	let otros = 0;
	for(let elemen of datos){
		if(elemen.modo == "Efectivo"){
			efectivo++;
		}
		if(elemen.modo == "Transferencia"){
			transferencia++;
		}
		if(elemen.modo == "Canje"){
			canje++;
		}
		if(elemen.modo == "Mercadería"){
			mercaderia++;
		}
		if(elemen.modo == "Cheque"){
			cheque++;
		}
		if(elemen.modo == "Otros"){
			otros++;
		}
	}
	sistema.efectivo=efectivo;
	sistema.transferencia=transferencia;
	sistema.canje=canje;
	sistema.mercaderia=mercaderia;
	sistema.cheque=cheque;
	sistema.otros=otros;
	drawChart();
}
var data;
var chart;
function drawChart() {											//Función de google
	let lista = sistema.listaDonaciones;
	data = new google.visualization.DataTable();
	data.addColumn('string', 'Modo');
	data.addColumn('number', 'Monto');
	data.addRows([
		['Efectivo', sistema.efectivo],
		['Transferencia', sistema.transferencia],
		['Canje', sistema.canje],
		['Mercadería', sistema.mercaderia],
		['Cheque', sistema.cheque],
		['Otro', sistema.otros]
				]);
    var options = {title:'Donaciones por modo',};
    chart = new google.visualization.PieChart(document.getElementById('piechart'));
    if(lista.length > 0){
		chart.draw(data, options);
	}
}