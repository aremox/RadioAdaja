var rss = require('rss');
var html = require('html');
var args = arguments[0] || {};


function mostrarMenu(e) {
	Alloy.Globals.drawer.toggleLeftWindow();
	
}
function recargar(e) {
	refreshRss();
	 var tr_start = Titanium.UI.create2DMatrix();
tr_start = tr_start.rotate(30);
 
var tr_end = Titanium.UI.create2DMatrix();
tr_end = tr_end.rotate(-30);
tr_end = tr_end.scale(2);

$.botonRecargar.animate({
	transform:tr_end,
	repeat:5,
	autoreverse:true,
	duration:500,
	curve:Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
});
}

function refreshRss() {
	Ti.API.info("--------------------- Llama a rss.loadRssFeed --------------------------------");
	rss.loadRssFeed({
		success: function(data) {
			var rows = [];
			Ti.API.info("--------------------- Recuperamos rss.loadRssFeed --------------------------------");
			recorrer(data,rows,function(rows){
				$.listaNoticias.setItems(rows);
			});
			
			
		}
	});
}


function recorrer(data,rows,retorno){
	var tamano = data.length; 
	var rows2 = [];
	Ti.API.info("++++++++++"+ tamano + "++++++++++");
	for (var i = 0; i < data.length; i++) {
	rows2[i]=0;
	}
	Ti.API.info("++++++++++"+ data.length + "++++++++++");
	for (var i = 0; i < data.length; i++) {
	var item = data[i];
	var z= 0;
				rss.obtenerImagen(item,i,function(item,i) {
		
				Ti.API.info("-------------------- I: "+i+"///"+ item.image+" --------------------------------");
				var textoConvertido = "";
				
				
				var tmp = {
						properties : {

						}, // properties for the template
						pic : {
							image : item.image,
							dataInfo : item.image //lets pass to the Label the object fooB
						},
						info : {
							text : item.title,
							dataInfo : item.title //lets pass to the Label the object fooB
						},
						es_info : {
							text : item.pubDate,
							dataInfo : item.textoNoticia
						},
						url : {
							text : item.link,
							dataInfo : item.link
						},
						
						template : 'template' // here goes the name of the template in your xml, **do not confuse name with id, both are different and using one doesn't replace the other**
					};
					rows[i] = tmp;
					z++;
					//rows.push(tmp);
					
					if(z == tamano){
				Ti.API.info("--------ROWS2-------- "+JSON.stringify(rows)+"--------------------------------");
				Ti.API.info("--------------------- volvemos --------------------------------");
				retorno(rows);
			}
			});
			
			}
}

//////////////Ejecutamos al inicio //////////////////
refreshRss();

///////////// Envio a detalles ///////////////////
function detalle(e){
	var section = $.listViewNoticias.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);
	var currentTitulo = item.info.text;
	var currentImagen = item.pic.image;
	var currentTextoNoticia = "";
	var currentURLNoticia = item.url.text;
	var currentFecha = item.es_info.text;
	html.convertirHTML(item.es_info.dataInfo,function (texto){ 
					currentTextoNoticia = texto;
				});

   controller = Alloy.createController('detalle');
   var win = controller.getView();
   controller.setTitulo(currentTitulo); 
   controller.setImagen(currentImagen); 
   controller.setTextoNoticia(currentTextoNoticia); 
   controller.setURLNoticia(currentURLNoticia);
   controller.setFecha(currentFecha);
   win.open();
   
}
