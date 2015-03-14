var html = require('html');
function mostrarMenu(e) {
	Alloy.Globals.drawer.toggleLeftWindow();

}

// Encase the title attribute in square brackets
function transformFunction(model) {
	// Need to convert the model to a JSON object
	var transform = model.toJSON();
	transform.title = '' + transform.titulo;
	transform.subtitle = "Puesto: " + transform.imagen + " Salario: " + transform.cuerpo;
	return transform;
}

function filterFunction(collection) {
	return collection.where({
		marcado : 1
	});
}

// Trigger the synchronization
var favoritoTotal = Alloy.Collections.favoritos;
favoritoTotal.fetch();

$.favorito.addEventListener('close', function() {
	$.destroy();
});

///////////// Envio a detalles ///////////////////
function detalle(e) {
	var section = $.listViewNoticias.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);
	var currentTitulo = item.info.text;
	var currentImagen = item.pic.image;
	var currentTextoNoticia = item.es_info.dataInfo;
	var currentURLNoticia = item.url.dataInfo;
	var currentFecha = item.es_info.text;
	//Ti.API.info("++++++++"+item.es_info.dataInfo+"++++++++");
	/*html.convertirHTML(item.es_info.dataInfo, function(texto) {
		currentTextoNoticia = texto;
		
	});*/
	//alert("itemIndex: " + currentTitulo + "\n" + "BindId: " + currentTextoNoticia + "\n" + "Source: " + currentURLNoticia);
	controller = Alloy.createController('detalle');
	 var win = controller.getView();
	 controller.setTitulo(currentTitulo);
	 controller.setImagen(currentImagen);
	 controller.setTextoNoticia(currentTextoNoticia);
	 controller.setURLNoticia(currentURLNoticia);
	 controller.setFecha(currentFecha);
	 win.open();

}
