var RSS_URL = OS_MOBILEWEB ? '/rss' : 'http://www.radioadaja.es/rss';
var DOMINIO = "http://www.radioadaja.es";
var MONTH_MAP = {
	JAN : 1,
	FEB : 2,
	MAR : 3,
	APR : 4,
	MAY : 5,
	JUN : 6,
	JUL : 7,
	AUG : 8,
	SEP : 9,
	OCT : 10,
	NOV : 11,
	DEC : 12
};

var getRssText = function(item, key) {
	var RssText = OS_MOBILEWEB ? item.getElementsByTagName(key).item(0).textContent : item.getElementsByTagName(key).item(0).textContent;
	Ti.API.info("--------------------- RssText:" + RssText + " --------------------------------");
	return RssText;
};

var parseDate = function(dateString) {
	var dateParts = dateString.split(' ');
	var timeParts = dateParts[4].split(':');
	Ti.API.info("--------------------- dateParts:" + dateParts + " --------------------------------");
	//return dateParts[1] + '/' + MONTH_MAP[dateParts[2].toUpperCase()] + ' ' + timeParts[0] + ':' + timeParts[1];
	return dateParts[1] + '/' + MONTH_MAP[dateParts[2].toUpperCase()]+'/'+dateParts[3];
};

exports.loadRssFeed = function(o, tries) {
	var xhr = Titanium.Network.createHTTPClient();
	tries = tries || 0;
	Ti.API.info("--------------------- Llama a "+RSS_URL+" --------------------------------");
	xhr.open('GET', RSS_URL);
	xhr.onload = function(e) {
		var xml = this.responseXML;

		if (xml === null || xml.documentElement === null) {
			if (tries < 3) {
				tries++;
				exports.loadRssFeed(o, tries);
				return;
			} else {
				alert('Error reading RSS feed. Make sure you have a network connection and try refreshing.');
				if (o.error) {
					o.error();
				}
				return;
			}
		}

		var items = xml.documentElement.getElementsByTagName("item");
		var data = [];
		var limite = 10;
		if (items.length < 10) {
			limite = items.length;
		}
		for (var i = 0; i < limite; i++) {
			var item = items.item(i);
			var image = '';
			var texto = '';
			//var enlace = getRssText(item, 'link');
			//enlace+exports.obtenerImagen(getRssText(item, 'link'));
			data.push({
				title : getRssText(item, 'title'),
				link : getRssText(item, 'link'),
				pubDate : parseDate(getRssText(item, 'pubDate')),
				image : image,
				textoNoticia : getRssText(item, 'description')
			});
		}
		if (o.success) {
			o.success(data);
		}
	};
	xhr.onerror = function(e) {
		if (o.error) { o.error(); }
	};

	if (o.start) { o.start(); }
	xhr.send();
};

// Capturar imagenes
exports.obtenerImagen = function(item,numero,retorno) {
	url_imagen = item.link;
	Ti.API.info("--------------------- LINK:" + item.link + " --------------------------------");
	var z = "";
	
	Ti.Yahoo.yql('SELECT * FROM data.html.cssselect WHERE url="'+url_imagen+'" AND css="div.cuerpo"',function(e){
		var datos = e.data;
		try {
		if(JSON.stringify(datos.results.div.div[0])){
			var foto = JSON.stringify(datos.results.div.div[0].img.src).replace(/"/gi,'');
		}else{
			var foto = JSON.stringify(datos.results.div.div.img.src).replace(/"/gi,'');
		}
		
		Ti.API.warn("--------------------- FOTO:" + foto + " --------------------------------");
		item.image =  DOMINIO+foto;
		} catch(e) {
		item.image = "";
		}
		retorno(item,numero);
	});
};
