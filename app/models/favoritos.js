exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "titulo": "text",
		    "cuerpo": "text",
		    "imagen": "text",
		    "marcado": "INTEGER",
		    "enlace": "text",
		    "fecha": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "favoritos",
			idAttribute : 'id',
			db_name : 'BD'
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};