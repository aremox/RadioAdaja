var titulo = "Noticias";
var enlace = "";
var imagen = "";
var cuerpo = "";
var marcado = 0;
var fecha = "";
var favoritos = Alloy.Collections.favoritos;

function mostrarMenu() {
	if(OS_ANDROID) {
		var actividad = $.index.getActivity();
		actividad.finish();
	}else{
		$.index.close();
	}
}

exports.setTitulo = function(etiqueta) {
	$.titulo.setText(etiqueta);
	titulo = etiqueta;
	Ti.API.info('paso por aqui ' + titulo);
	comprobarFavorito();
};
exports.setImagen = function(etiqueta) {
	$.imagenNoticia.setImage(etiqueta);
	imagen = etiqueta;
	Ti.API.info('paso por aqui ' + imagen);
};
exports.setTextoNoticia = function(etiqueta) {
	$.textoNoticia.setText(etiqueta);
	cuerpo = etiqueta;
	Ti.API.info(etiqueta);
};
exports.setURLNoticia = function(etiqueta) {
	//$.URLNoticia.setText(etiqueta);
	enlace = etiqueta;
	Ti.API.info("link " + etiqueta);
};
exports.setFecha = function(etiqueta) {
	//$.URLNoticia.setText(etiqueta);
	fecha = etiqueta;
	Ti.API.info("++++++++ Fecha " + fecha+"++++++++");
};

/// Favoritos /////////
function anadirFavorito() {
	//Factory method for instantiating a Backbone collection of model objects
	var recoverDatabase = Alloy.createCollection("favoritos");
	//We need the database to iterate through it
	recoverDatabase.fetch({
		query : 'SELECT * FROM favoritos where titulo = "' + titulo + '"'
	});
	if (recoverDatabase.length <= 0) {
		$.botonFavorito.setImage("/material/ic_star_white_48dp.png");

		//alert($.nombre.value);

		var task = Alloy.createModel('favoritos', {
			titulo : titulo,
			imagen : imagen,
			cuerpo : cuerpo,
			marcado : 1,
			enlace : enlace,
			fecha : fecha
		});
		favoritos.add(task);
		marcado = 1;

		// save the model to persistent storage
		task.save();
	} else {

		for (var i = 0; i < recoverDatabase.length; i++) {
			//This is how we are getting the value of id:toDoList .at(i).get("id_toDoList")
			if (recoverDatabase.at(i).get("titulo") == titulo) {
				var table = Alloy.createCollection("favoritos");
				//e.row.rowId is a custom property created in the .xml file that contains the primary key of every value in the database
				table.fetch({
					query : 'SELECT * FROM favoritos where titulo = "' + titulo + '"'
				});
				//if the query returned with more than 0 rows
				if (table.length > 0) {
					//if the record(hasCheck) of the column is false
					if (table.at(0).get("marcado") == 0) {
						marcado = 1;
						$.botonFavorito.setImage("/material/ic_star_white_48dp.png");
						//This is how we set a value to the database
						table.at(0).set({
							titulo : titulo,
							//then we set it to true
							marcado : 1
						});
						table.at(0).save();
					} else {
						//if not we set it to false
						marcado = 0;
						$.botonFavorito.setImage("/material/ic_star_outline_white_48dp.png");
						table.at(0).set({
							titulo : titulo,
							marcado : 0
						});
						table.at(0).save();
					}
					//Get the latest database state
					Alloy.Collections.favoritos.fetch();
				}
			}
		}

	}

	favoritos.fetch();
}

function comprobarFavorito() {
	
	$.botonFavorito.setImage("/material/ic_star_outline_white_48dp.png");
	Ti.API.warn('paso por aqui marcado igual a ' + titulo);
	var comprobacion = Alloy.createCollection("favoritos");

	comprobacion.fetch({
		query : 'SELECT * FROM favoritos where titulo = "' + titulo + '"'
	});

	for (var i = 0; i < comprobacion.length; i++) {
		marcado = comprobacion.at(i).get("titulo");
		//Ti.API.warn('---paso por aqui marcado igual a '+marcado);
		//This is how we are getting the value of id:toDoList .at(i).get("id_toDoList")
		if (comprobacion.at(i).get("marcado") == 1) {
			marcado = comprobacion.at(i).get("titulo");
			//Ti.API.warn('---paso por aqui marcado igual a '+marcado);
			$.botonFavorito.setImage("/material/ic_star_white_48dp.png");
			marcado = 1;
		}
	}
	
}

//// Compartir /////////////
function compartir() {
	if(OS_ANDROID) {
	var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_SEND,
		type : "text/plain"
	});

	intent.putExtra(Ti.Android.EXTRA_TEXT, titulo + ". Enlace: " + enlace);
	intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
	Ti.Android.currentActivity.startActivity(intent);
	}
}

