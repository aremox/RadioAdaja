$.aContinuacion.setText("A continuacion:");
obtenerDatos();
$.textoMenu.setText("Radio Adaja");
actualizar();

Alloy.Globals.sonandoAhora = "nada";
////////////////////////////////////////////////////////////////////
/////
/////   Rotacion
/////
/////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
/////
/////   Funciones
/////
/////////////////////////////////////////////////////////////////////

// Quitar caracteres innecesarios
function quitarRetorno(cadena, retornos) {
	cadena = cadena.replace(new RegExp('"', 'g'), '');
	switch(retornos) {
	case 0:

		break;
	case 1:
		cadena = cadena.replace(/^\s+/, '').replace(/\s+$/, '').replace(new RegExp('n$'), '').replace("\\", '').replace(/^\s+/, '').replace(/\s+$/, '');
		break;

	}

	return cadena;
}

// Traer datos de radio adaja
function obtenerDatos() {
	$.botonRecargar.setTouchEnabled(false);
	Ti.API.info("++++++++++++++++++++++++ Boton deshabilitado ++++++++++++++++++++++++++++++++++++");
	$.botonRecargar.setImage("/material/ic_refresh_grey600_48dp.png");
	var texto;
	var data = [];
	// Datos de radio adaja en remoto
	var url = "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20data.html.cssselect%20WHERE%20url%3D'http%3A%2F%2Fradioadaja.es%2Fdirecto%2F'%20AND%20css%3D'div.home_programacion'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			var data = [];
			var dias = [];
			var itemCollection = [];
			var sonandoAhora = "";
			var doc = JSON.parse(this.responseText);
			Ti.API.info(JSON.stringify(doc));
			if (JSON.stringify(doc.query.results != null)) {

				//$.listaProgramacion.setHeaderTitle(quitarRetorno(JSON.stringify(doc.query.results.results.div.div[1].p), 1));
				if (JSON.stringify(doc.query.results.results.div.div[2])) {
					var fecha2 = quitarRetorno(JSON.stringify(doc.query.results.results.div.div[2].p), 1);
					$.listaProgramacion2.setHeaderTitle(fecha2);
					Ti.API.info("Fecha de programas segundo dia: " + fecha2);
				}
				Ti.API.info("-------------ZONA Sonando ahora ------------------");
				try {
					//sonando ahora
					if (JSON.stringify(doc.query.results.results.div.ul[0])) {
						var lista_programas = doc.query.results.results.div.ul[0];
						Ti.API.info("JSON Sonando ahora [0]: " + JSON.stringify(lista_programas));
						dias = doc.query.results.results.div.ul;
					} else {
						var lista_programas = doc.query.results.results.div.ul;
						Ti.API.info("JSON Sonando ahora: " + JSON.stringify(lista_programas));
						dias.push(lista_programas);
					}
				
				
				if (JSON.stringify(lista_programas.li[0].p.content)) {
					Ti.API.info("sonando ahora[0].p.content");
					sonandoAhora = JSON.stringify(lista_programas.li[0].p.content);
					sonandoAhora = quitarRetorno(sonandoAhora, 1);
				} else {
					if (JSON.stringify(lista_programas.li[0].p)) {
						Ti.API.info("sonando ahora[0].p");
						sonandoAhora = JSON.stringify(lista_programas.li[0].p);
						sonandoAhora = quitarRetorno(sonandoAhora, 1);
					} else {
						Ti.API.info("sonando ahora.p");
						sonandoAhora = JSON.stringify(lista_programas.li.p);
						sonandoAhora = quitarRetorno(sonandoAhora, 0);
					}
				}
				
				Alloy.Globals.sonandoAhora = sonandoAhora;
				Ti.API.info("sonando ahora: " + sonandoAhora);
				$.titulo_directo.setText(sonandoAhora);
				} catch(e) {
					alert("No se ha podido obtener lo que suena ahora");
					Ti.API.error("No se ha podido obtener lo que suena ahora");
				}
				try {
				Ti.API.info("Dia 0: " + JSON.stringify(dias[0].li));
				

				for (var z = 0; z < dias.length; z++) {
					items = dias[z].li;
					for (var i = 1; i < items.length; i++) {
						Ti.API.info(JSON.stringify(items[i]));
						if (items[i].div.p) {
							var hora = JSON.stringify(items[i].div.p);
						} else {
							var hora = "Hora";
						}
						var hora = JSON.stringify(items[i].div.p);
						var programa = JSON.stringify(items[i].p.content);
						if (!programa) {
							programa = JSON.stringify(items[i].p);
							programa = quitarRetorno(programa, 0);
						} else {
							programa = quitarRetorno(programa, 1);
						}

						Ti.API.info("hora:" + hora + " || programa:" + programa);
						var tmp = {
							properties : {

							}, // properties for the template
							info : {
								text : quitarRetorno(hora, 1),
								dataInfo : "1hola"//lets pass to the Label the object fooB
							},
							es_info : {
								text : programa,
								dataInfo : "items[i].fooB" //lets pass to the Label the object fooB
							},
							template : 'template' // here goes the name of the template in your xml, **do not confuse name with id, both are different and using one doesn't replace the other**
						};
						itemCollection.push(tmp);
					}
					if (z == 0) {
						$.listaProgramacion.setItems(itemCollection);
					} else {
						$.listaProgramacion2.setItems(itemCollection);
					}
					itemCollection = [];
				}
				} catch(e) {
					alert("No se ha podido obtener lista de programas");
					Ti.API.error("No se ha podido obtener lista de programas");
				}
			} else {
				alerta();
			}
			
			$.botonRecargar.setImage("/material/ic_refresh_white_48dp.png");
			$.botonRecargar.setTouchEnabled(true);
			Ti.API.info("++++++++++++++++++++++++ Boton habilitado ++++++++++++++++++++++++++++++++++++");
		},
		onerror : function(e) {
			// this function is called when an error occurs, including a timeout
			Ti.API.error(e.error);
			//alert('Fallo al conectar con Radio Adaja');
			alerta();
			$.botonRecargar.setImage("/material/ic_refresh_white_48dp.png");
			$.botonRecargar.setTouchEnabled(true);
			Ti.API.info("++++++++++++++++++++++++ Boton habilitado ++++++++++++++++++++++++++++++++++++");
		},
		timeout : 10000 /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();
}

// Reconexion y alerta al recuperar datos de programacion
function alerta() {
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Salir', 'Cancelar', 'Reconectar'],
		message : '¿Que desea hacer?',
		title : 'Fallo de conexion'
	});
	dialog.addEventListener('click', function(e) {
		switch(e.index) {
		case 0:
			Ti.API.info('Boton Salir');
			Ti.API.info('e.cancel: ' + e.cancel);
			Ti.API.info('e.source.cancel: ' + e.source.cancel);
			Ti.API.info('e.index: ' + e.index);
			var activity = Titanium.Android.currentActivity;
			activity.finish();
			break;
		case 1:
			Ti.API.info('Boton Cancelar');
			Ti.API.info('e.cancel: ' + e.cancel);
			Ti.API.info('e.source.cancel: ' + e.source.cancel);
			Ti.API.info('e.index: ' + e.index);
			break;
		case 2:
			Ti.API.info('Boton Reconectar');
			Ti.API.info('e.cancel: ' + e.cancel);
			Ti.API.info('e.source.cancel: ' + e.source.cancel);
			Ti.API.info('e.index: ' + e.index);
			obtenerDatos();
			break;

		}
	});
	dialog.show();
}

function mostrarMenu(e) {
	Alloy.Globals.drawer.toggleLeftWindow();

}

function recargar(e) {
	obtenerDatos();
	var tr_start = Titanium.UI.create2DMatrix();
	tr_start = tr_start.rotate(30);

	var tr_end = Titanium.UI.create2DMatrix();
	tr_end = tr_end.rotate(-30);
	tr_end = tr_end.scale(2);

	$.botonRecargar.animate({
		transform : tr_end,
		repeat : 5,
		autoreverse : true,
		duration : 500,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
	});
}

function actualizar(e) {
	var d = new Date();
	var tiempo = (15 - (d.getMinutes() % 15)) * 1000 * 60;
	Ti.API.info("tiempo: " + tiempo);
	setTimeout(function() {
		Ti.API.info("getTime: " + d.getMinutes());
		actualizar();
		obtenerDatos();
	}, tiempo);

}
