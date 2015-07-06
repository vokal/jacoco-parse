"use strict";

var assert = require( "assert" );
var parse = require( "../source" );
var path = require( "path" );


describe( "parseFile", function ()
{
    it( "should parse a file", function ( done )
    {
        parse.parseFile( path.join( __dirname, "assets", "sample.xml" ), function ( err, result )
        {
            assert.equal( err, null );
            assert.equal( result.length, 1 );
            assert.equal( result[ 0 ].functions.found, 5 );
            assert.equal( result[ 0 ].functions.hit, 1 );
            assert.equal( result[ 0 ].branches.found, 4 );
            assert.equal( result[ 0 ].branches.hit, 1 );
            assert.equal( result[ 0 ].lines.found, 13 );
            assert.equal( result[ 0 ].lines.hit, 3 );
            assert.equal( result[ 0 ].functions.details[ 0 ].line, 8 );
            assert.equal( result[ 0 ].functions.details[ 0 ].hit, 0 );
            assert.equal( result[ 0 ].branches.details[ 0 ].line, 13 );
            assert.equal( result[ 0 ].branches.details[ 0 ].taken, 1 );
            assert.equal( result[ 0 ].branches.details[ 1 ].line, 13 );
            assert.equal( result[ 0 ].branches.details[ 1 ].taken, 0 );
            assert.equal( result[ 0 ].lines.details[ 0 ].line, 8 );
            assert.equal( result[ 0 ].lines.details[ 0 ].hit, 0 );
            done();
        } );
    } );
} );
