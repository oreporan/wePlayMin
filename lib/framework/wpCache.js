var logger = require('../utils/logger').init('wpCache');
var NodeCache = require( "node-cache" );
var cache = new NodeCache( { stdTTL: 60, checkperiod: 70 } );

module.exports.setById = function(id, object) {
	cache.set( id, object, function( err, success ){
		if( !err && success ){
		} else {
			logger.error('setById', "cache error");
		}
	});
};

module.exports.getById = function(id, callback) {
	cache.get(id , function( err, object ){
		if( !err ){
			if(object == undefined){
				// key not found
				callback(err, null);
			} else {
				logger.audit('getById', "object with id: " + id + " found in cache");
				callback(null, object);
			}
		} else {
			callback(err, null);
		}
	});
};

module.exports.getMultyObjectsByIDsArray = function(IDsArray, callback) {
	cache.mget( IDsArray, function( err, docs ){
		if( !err ){
			if(Object.keys(docs).length < IDsArray.length) {
				// key not found
				callback(err, null);
			} else {
				logger.audit('getMultyObjectsByIDsArray', "objexts found in cache");
				callback(null, docs);
			}
		} else {
			callback(err, null);
		}
	});
};
