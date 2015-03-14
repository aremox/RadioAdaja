// Action Bar - REAL example
$.drawer.addEventListener('open', onNavDrawerWinOpen);
$.favoritos = Alloy.createController('favorito').getView();
$.centroW.add($.favoritos);
$.noticias = Alloy.createController('noticias').getView();
$.centroW.add($.noticias);
$.directo = Alloy.createController('directo').getView();
$.centroW.add($.directo);


function onNavDrawerWinOpen(evt) {
	this.removeEventListener('open', onNavDrawerWinOpen);

	if (this.getActivity()) {
		// need to explicitly use getXYZ methods
		var actionBar = this.getActivity().getActionBar();
		if (actionBar) {
			actionBar.hide();
		}
	}
}

$.drawer.open();

function toggle(e) {
	//var fn = 'toggle' + e.source.title + 'Window';
	//$.drawer[fn]();
}

exports.menuIzquierda = function(evt) {
	$.drawer.toggleLeftWindow();
};

Alloy.Globals.drawer = $.drawer;

function noticias() {
	$.noticias.visible = true;
	$.favoritos.visible = false;
	for (var i = $.centroW.children.length - 1; i >= 0; i--) {
		Ti.API.info($.centroW.children[i].id + " (" + i + ")");

		if ($.centroW.children[i].id == "central" ) {
			Ti.API.info("Se elimina: " + $.centroW.children[i].id + " (" + i + ")");
			$.directo.visible = false;
		}
	}
	$.drawer.toggleLeftWindow();
	//animate back to center
}

function directoBoton() {
	$.directo.visible = true;
	$.favoritos.visible = false;
	for (var i = $.centroW.children.length - 1; i >= 0; i--) {
		Ti.API.info($.centroW.children[i].id + " (" + i + ")");
		if ($.centroW.children[i].id == "noticias") {
			Ti.API.info("Se elimina: " + $.centroW.children[i].id + " (" + i + ")");
			$.noticias.visible = false;
		}
	}
	$.drawer.toggleLeftWindow();
	//animate back to center
}

function favoritosBoton() {
	$.directo.visible = false;
	$.noticias.visible = false;
	$.favoritos.visible = true;
	$.drawer.toggleLeftWindow();
	//animate back to center
}

$.listViewMenu.addEventListener('itemclick', function(e) {
	var item = $.menuSection.getItemAt(e.itemIndex);
	Ti.API.info(item.itemId);

	switch (e.itemId) {
	case  "noticias":
		noticias();
		break;
	case "directoBoton":
		directoBoton();
		break;
	case "favoritos":
		favoritosBoton();
		break;
	default:
		alert("ItemId: " + e.itemId + "\n" + "BindId: " + e.bindId + "\n" + "Section Index: " + e.sectionIndex + ", Item Index: " + e.itemIndex);
	}

});

