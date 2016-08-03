const expect = require( 'chai' ).expect;

const Table = require( 'cli-table' );

const Rank = require( '../../app/command/rank' );

describe( 'Rank command', () => {
	'use strict';
	let table;

	beforeEach( () => {
		table = new Table( {
			head: [ '', 'Player:', 'Score:', 'Matches:' ],
			style: { compact: true },
			colAligns: [ 'right', 'left', 'right', 'right' ]
		} );
	} );

	it( 'should return false for wrong command', () => {
		const rankCommand = new Rank();

		const wrongCommands = [
			'',
			'lolz',
			'register',
			'history'
		];

		for ( let command of wrongCommands ) {
			expect( rankCommand.handleRequest( makeRequest( command ), () => expect.fail() ) ).to.be.undefined;
		}
	} );

	it( 'should return info that there are no players in rank', () => {
		const rankCommand = new Rank( { rank: { getPlayers: () => [] } } );

		expect( rankCommand.handleRequest( makeRequest( 'rank' ) ) )
			.to.have.property( 'text' )
			.that.equals( 'No players in the rank.' );
	} );

	it( 'should return rank for players', () => {
		const rankCommand = new Rank( {
			rank: {
				getPlayers: () => [
					{ name: 'A', score: 3000, matches: 100 },
					{ name: 'B', score: 2000, matches: 100 },
					{ name: 'C', score: 1000, matches: 100 },
					{ name: 'D', score: 1000, matches: 100 }
				]
			}
		} );

		table.push( [ '1.', 'A', 3000, 100 ] );
		table.push( [ '2.', 'B', 2000, 100 ] );
		table.push( [ '3.', 'C', 1000, 100 ] );
		table.push( [ '', 'D', 1000, 100 ] );

		expect( rankCommand.handleRequest( makeRequest( 'rank' ) ) )
			.to.have.property( 'text' )
			.that.equals( '```' + table.toString() + '```' );
	} );

	it( 'should not include rookie and oldboys players in rank', () => {
		const rankCommand = new Rank( {
			rank: {
				getPlayers: ( options ) => {
					expect( options ).to.deep.equal( { rookies: false, oldBoys: false } );
					return [];
				}
			}
		} );

		expect( rankCommand.handleRequest( makeRequest( 'rank' ) ) )
			.to.have.property( 'text' )
			.that.equals( 'No players in the rank.' );
	} );

	it( 'should include rookie players when rookies modifier is passed', () => {
		const rankCommand = new Rank( {
			rank: {
				getPlayers: ( options ) => {
					expect( options ).to.deep.equal( { rookies: true, oldBoys: false } );
					return [];
				}
			}
		} );

		expect( rankCommand.handleRequest( makeRequest( 'rank rookies' ) ) )
			.to.have.property( 'text' )
			.that.equals( 'No players in the rank.' );
	} );

	it( 'should include rookie players when oldboys modifier is passed', () => {
		const rankCommand = new Rank( {
			rank: {
				getPlayers: ( options ) => {
					expect( options ).to.deep.equal( { rookies: false, oldBoys: true } );
					return [];
				}
			}
		} );

		expect( rankCommand.handleRequest( makeRequest( 'rank oldboys' ) ) )
			.to.have.property( 'text' )
			.that.equals( 'No players in the rank.' );
	} );

	it( 'should include all players when full modifier is passed', () => {
		const rankCommand = new Rank( {
			rank: {
				getPlayers: ( options ) => {
					expect( options ).to.deep.equal( { rookies: true, oldBoys: true } );
					return [];
				}
			}
		} );

		expect( rankCommand.handleRequest( makeRequest( 'rank full' ) ) )
			.to.have.property( 'text' )
			.that.equals( 'No players in the rank.' );
	} );

	function makeRequest( command ) {
		return {
			text: command,
			resolvedText: command,
			user_name: 'jodator',
			response_url: 'just test'
		};
	}
} );