exports.definition = {
	config : {
		columns : {
			"id" : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			"nombre" : "TEXT",
			"puesto" : "TEXT",
			"sueldo" : "INTEGER"
		},
		adapter : {
			type : "sql",
			collection_name : "empleados",
			idAttribute : 'id',
			db_name : 'BD'
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
}; 