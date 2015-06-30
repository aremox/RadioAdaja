// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

if(Ti.App.Properties.getBool('primer',true)==true)
{
var db = Ti.Database.open('BD');
//db.execute('DROP TABLE favoritos');
db.execute('CREATE TABLE IF NOT EXISTS favoritos(id INTEGER PRIMARY KEY, titulo TEXT, cuerpo TEXT, imagen TEXT, marcado INTEGER, enlace TEXT, fecha TEXT)');
db.close();
Ti.App.Properties.setBool('primer',false);
}