

exports.convertirHTML = function(dato, retorno) {
var arrayTexto = "";
var res = dato.split("<");
for (var i = 0; i < res.length; i++) {
	var data = res[i].split(">");
	if(data[1]){
	data[1] = data[1].replace(/&nbsp;/g, ' ');
	data[1] = data[1].replace(/&quot;/g, '"');
	data[1] = data[1].replace(/&#170;/g, "ª");
	data[1] = data[1].replace(/&#186;/g, "º");
	data[1] = data[1].replace(/&#193;/g, "Á");
	data[1] = data[1].replace(/&#201;/g, "É");	
	data[1] = data[1].replace(/&#205;/g, "Í");
	data[1] = data[1].replace(/&#225;/g, "á");
	data[1] = data[1].replace(/&#233;/g, "é");
	data[1] = data[1].replace(/&#237;/g, "í");
	
	data[1] = data[1].replace(/&#241;/g, "ñ");
	data[1] = data[1].replace(/&#243;/g, "ó");
	data[1] = data[1].replace(/&#250;/g, "ú");
	data[1] = data[1].replace(/&#251;/g, "û");
	data[1] = data[1].replace(/&#252;/g, "ü");
	data[1] = data[1].replace(/&#8216;/g, "‘");
	data[1] = data[1].replace(/&#8217;/g, "’");
	data[1] = data[1].replace(/&#8220;/g, '"');
	data[1] = data[1].replace(/&#8221;/g, '"');
	arrayTexto = arrayTexto+" "+data[1];
	}
}
Ti.API.info(arrayTexto);
retorno(arrayTexto);
};