var logger = require('../utils/logger').init('wpCache');
var NodeCache = require( "node-cache" );
var cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

module.exports.setById = function(id, object) {
	cache.set( id, object, function( err, success ){
		if( !err && success ){
			logger.audit('setById', "object cached with id: " + id);
		} else {
			logger.audit('setById', "cache error");
		}
	});		
};

module.exports.getById = function(id, callback) {
	cache.get(id , function( err, object ){
		if( !err ){
			if(object == undefined){
				// key not found
				logger.audit('getById', "object with id: " + id + " not found in cache");
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
				logger.error('getMultyObjectsByIDsArray', "objects not found in cache");
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