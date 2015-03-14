var general = require('com.aremox.modulogeneral');
var audioPlayer = Ti.Media.createAudioPlayer({
	url : 'http://173.236.61.226:80/stream',
	allowBackground : true
});

var volumen = (audioPlayer.getVolume() * 100);
Ti.API.info('Volumen Played: ' + volumen);
$.sonido.setValue(volumen);

var progreso = 0;

////////////////////////////////////////////////////////////////////
/////
/////   Funciones
/////
/////////////////////////////////////////////////////////////////////
function actualizarVolumen(e) {
	audioPlayer.setVolume(e.value / 100);
};
setTimeout(function() {
	Alloy.Globals.drawer.addEventListener('android:back', cerrar);
	audioPlayer.stop();
}, 2000);

function stopAudio(e) {
	Ti.API.info('Se pulsa el boton de audio');
	// When paused, playing returns false.
	// If both are false, playback is stopped.
	if (audioPlayer.playing || audioPlayer.paused) {
		$.startStopButton.setImage("/material/ic_play_arrow_white_48dp.png");
		audioPlayer.stop();
		Ti.Android.NotificationManager.cancel(1);
		Ti.API.info('Borrando general.sendAppToBackground()');
		Alloy.Globals.drawer.removeEventListener('android:back', androidBack);
		Alloy.Globals.drawer.addEventListener('android:back', cerrar);
		if (Ti.Platform.name === 'android') {
			audioPlayer.release();
		}
	} else {
		if ($.estado.getText() == "en pausa..." || $.estado.getText() == "") {
			Ti.API.info('Por aqui no tengo que pasar ' + $.estado.getText());
			$.startStopButton.setImage("/material/ic_stop_white_48dp.png");
			audioPlayer.start();
			customLayout.setTextViewText(AppR.id.title, Alloy.Globals.sonandoAhora);
			Ti.Android.NotificationManager.notify(1, alarmTimeNotification);
			Ti.API.info('Borrando cerrar()');
			Alloy.Globals.drawer.removeEventListener('android:back', cerrar);
			Alloy.Globals.drawer.addEventListener('android:back', androidBack);
		}
		if( $.estado.getText() == "cargando..."){
			Ti.API.error('Fallo de conexión reinicio cuelgue: ' + Math.round(e.progress) + ' milliseconds');
			audioPlayer.stop();
			if (Ti.Platform.name === 'android') {
				audioPlayer.release();
			}
			setTimeout(function() {
				audioPlayer.start();
			}, 100);
		}
	}
};
function androidBack() {
	general.sendAppToBackground();
};

function cerrar() {
	Alloy.Globals.drawer.removeEventListener('android:back', function() {
	});
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Sí', 'No'],
		message : '¿Desea cerrar la aplicación?',
		title : 'Cerrar aplicación'
	});

	dialog.addEventListener('click', function(e) {
		switch(e.index) {
		case 1:
			Ti.API.info('Boton Cancelar');
			Ti.API.info('e.cancel: ' + e.cancel);
			Ti.API.info('e.source.cancel: ' + e.source.cancel);
			Ti.API.info('e.index: ' + e.index);
			break;

		case 0:
			Ti.API.info('Boton Salir');
			Ti.API.info('e.cancel: ' + e.cancel);
			Ti.API.info('e.source.cancel: ' + e.source.cancel);
			Ti.API.info('e.index: ' + e.index);
			audioPlayer.stop();
			Ti.Android.NotificationManager.cancel(1);
			var activity = Titanium.Android.currentActivity;
			activity.finish();
			break;

		default:

		}
	});
	dialog.show();
}


////////////////////////////////////////////////////////////////////
/////
/////   Disparadores
/////
/////////////////////////////////////////////////////////////////////

// Disparador que pinta un log del tiempo de reproduccion
var contador = 0;
audioPlayer.addEventListener('progress', function(e) {
	
	Ti.API.info('Time Played: ' + Math.round(e.progress) + ' milliseconds');
	if (progreso != 0) {
		if (progreso == Math.round(e.progress)) {
			contador++;
			Ti.API.error('Fallo de conexión: ' + Math.round(e.progress) + ' milliseconds (' + contador + ')');
			if(contador >= 4){				
			audioPlayer.pause();
			//if (Ti.Platform.name === 'android') {
			//	audioPlayer.release();
			//}
			setTimeout(function() {
				audioPlayer.start();
			}, 100);
			contador = 0;
			}
			

		}else{
			contador = 0;
		}
	}
	progreso = Math.round(e.progress);

});

// Disparador que muestra el estado de la reproduccion y lo pinta en estado
audioPlayer.addEventListener('change', function(e) {
	switch(e.state) {
	case 1:
		$.estado.setText("inicializando");
		Ti.API.info('State: ' + e.description + ' (' + e.state + ')');
		break;
	case 2:
		$.estado.setText("pausa");
		Ti.API.info('State: ' + e.description + ' (' + e.state + ')');
		break;
	case 3:
		$.estado.setText("en directo...");
		Ti.API.info('State: ' + e.description + ' (' + e.state + ')');
		break;
	case 4:
		$.estado.setText("cargando...");
		Ti.API.info('State: ' + e.description + ' (' + e.state + ')');
		break;
	case 5:
		$.estado.setText("en pausa...");
		Ti.API.info('State: ' + e.description + ' (' + e.state + ')');
		break;
	case 6:
		$.estado.setText("Esperando datos");
		Ti.API.info('State: ' + e.description + ' (' + e.state + ')');
		break;
	case 7:
		$.estado.setText("Esperando datos");
		Ti.API.info('State: ' + e.description + ' (' + e.state + ')');
		break;
	}

});

// Disparador de cierre de aplicacion
$.radio.addEventListener('close', function() {
	audioPlayer.stop();
	if (Ti.Platform.osname === 'android') {
		audioPlayer.release();
	}
});

////////////////////////////////////////////////////////////////////
/////
/////   Notificacion
/////
/////////////////////////////////////////////////////////////////////

var activity = Ti.Android.currentActivity;
var intent = Ti.Android.createIntent({
	action : Ti.Android.ACTION_MAIN,
	url : 'alloy.js',
	flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
});
intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);

var pending = Ti.Android.createPendingIntent({
	activity : activity,
	intent : intent,
	type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
	flags : Titanium.Android.FLAG_UPDATE_CURRENT
});

var AppR = Ti.App.Android.R;
var customLayout = Ti.Android.createRemoteViews({
	layoutId : AppR.layout.custom_layout
});
customLayout.setImageViewResource(Ti.App.Android.R.id.image, Ti.App.Android.R.drawable.appicon);

var alarmTimeNotification = Ti.Android.createNotification({
	contentIntent : pending,
	contentView : customLayout,
	icon : Ti.App.Android.R.drawable.appicon,
	flags : Titanium.Android.NotificationManager.FLAG_NO_CLEAR
});

