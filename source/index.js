"use strict";

var fs = require( "fs" );
var parseString = require( "xml2js" ).parseString;

var parse = {};

var unpackage = function ( report )
{
    var packages = report.package;

    var output = []

    packages.forEach( function ( pack )
    {
        var cov = pack.sourcefile.map( function ( s ) 
        {
            var fullPath = pack.$.name + '/' + s.$.name
            var className = fullPath.substring(0, fullPath.lastIndexOf('.'));

            var c = pack.class.filter( function( cl ) 
            {
                return cl.$.name == className;
            })[0];

            var classCov = {
                title: s.$.name,
                file: fullPath,
                functions: {
                    found: c.method ? c.method.length : 0,
                    hit: 0,
                    details: !c.method ? [] : c.method.map( function ( m )
                    {
                        var hit = m.counter.some( function ( counter, index, array ) 
                        {
                            return counter.$.type == "METHOD" && counter.$.covered == "1";
                        });
                        return {
                            name: m.$.name,
                            line: Number( m.$.line ),
                            hit: hit ? 1 : 0
                        };
                    } )
                },
                lines: {
                    found: s.line ? s.line.length : 0,
                    hit: 0,
                    details: !s.line ? [] : s.line.map( function ( l )
                    {
                        return {
                            line: Number( l.$.nr ),
                            hit: Number( l.$.ci )
                        };
                    } )
                }
            };

            classCov.functions.hit = classCov.functions.details.reduce( function ( acc, val )
            {
                return acc + ( val.hit > 0 ? 1 : 0 );
            }, 0 );

            classCov.lines.hit = classCov.lines.details.reduce( function ( acc, val )
            {
                return acc + ( val.hit > 0 ? 1 : 0 );
            }, 0 );

            return classCov;
        });

        output = output.concat( cov );
    });

    return output;
};

parse.parseContent = function ( xml, cb )
{
    parseString( xml, function ( err, parseResult )
    {
        if( err )
        {
            return cb( err );
        }

        var result = unpackage( parseResult.report );

        cb( err, result );
    } );
};

parse.parseFile = function( file, cb )
{
    fs.readFile( file, "utf8", function ( err, content )
    {
        if( err )
        {
            return cb( err );
        }

        parse.parseContent( content, cb );
    } );
};

module.exports = parse;
