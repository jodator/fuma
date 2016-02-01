'use strict';

const config  = require( '../config' );

const http = require( 'http' );
const url  = require( 'url' );
const qs = require( 'querystring' );

const Controller  = require( './controller' );

const controller = new Controller();
controller.addCommand( 'result' );
controller.addCommand( 'history' );
controller.addCommand( 'help' );
controller.addCommand( 'remove' );
controller.addCommand( 'update' );

const server = http.createServer( function( request, response ) {
	let requestData = '';
	let jsonResponse;

	request.on( 'data', ( data ) => {
		requestData += data;

		if ( requestData.length > 1e6 ) {
			// Prevent DoS attack.
			request.connection.destroy();
		}
	} );

	request.on( 'end', function() {
		let query = qs.parse( requestData );

		if ( config.debug ) {
			query = url.parse( request.url, true ).query;
		}

		if ( query.token == config.token || config.debug ) {
			jsonResponse = controller.handleRequest( query );
		} else {
			jsonResponse = { 'text': 'Invalid token.' };
		}

		response.writeHead( 200, { 'Content-Type': 'application/json' } );

		response.end( JSON.stringify( jsonResponse ) );
	} );
} );

server.listen( config.port, function() {
	console.log( 'Server started on port ' + config.port + '!' );
} );
