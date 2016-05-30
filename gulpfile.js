/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var gulp = require('gulp');
var tsb = require('gulp-tsb');
var assign = require('object-assign');
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');

var TYPESCRIPT_LIB_SOURCE = path.join(__dirname, 'node_modules', 'typescript', 'lib');
var TYPESCRIPT_LIB_DESTINATION = path.join(__dirname, 'lib');

var compilation = tsb.create(assign({ verbose: true }, require('./tsconfig.json').compilerOptions));

gulp.task('release', ['compile'], function() {
	return merge(
			bundleOne('monaco.contribution'),
			bundleOne('lib/typescriptServices'),
			bundleOne('mode', ['vs/language/typescript/lib/typescriptServices']),
			bundleOne('worker', ['vs/language/typescript/lib/typescriptServices'])
		)
		.pipe(uglify())
		.pipe(gulp.dest('./release/'));
});

function bundleOne(moduleId, exclude) {
	return rjs({
		baseUrl: '/out/',
		name: 'vs/language/typescript/' + moduleId,
		out: moduleId + '.js',
		exclude: exclude,
		paths: {
			'vs/language/typescript': __dirname + '/out'
		}
	})
}

gulp.task('compile', ['import-typescript'], function() {
	var compiled = merge(
			gulp.src('src/*.ts', { base: '.' }),
			gulp.src('lib/*.d.ts', { base: '.' })
		)
		.pipe(compilation());
	return merge(
			gulp.src('lib/*.js', { base: '.' }),
			compiled
		)
		.pipe(gulp.dest('out'));
});

/**
 * Import files from TypeScript's dist
 */
gulp.task('import-typescript', function() {
	try {
		fs.statSync(TYPESCRIPT_LIB_DESTINATION);
	} catch (err) {
		fs.mkdirSync(TYPESCRIPT_LIB_DESTINATION);
	}
	importLibDeclarationFile('lib.d.ts');
	importLibDeclarationFile('lib.es6.d.ts');

	var tsServices = fs.readFileSync(path.join(TYPESCRIPT_LIB_SOURCE, 'typescriptServices.js')).toString();
	tsServices +=
`
// MONACOCHANGE
define([], function() { return ts; });
// END MONACOCHANGE
`;
	fs.writeFileSync(path.join(TYPESCRIPT_LIB_DESTINATION, 'typescriptServices.js'), tsServices);

	var dtsServices = fs.readFileSync(path.join(TYPESCRIPT_LIB_SOURCE, 'typescriptServices.d.ts')).toString();
	dtsServices +=
`
// MONACOCHANGE
export = ts;
// END MONACOCHANGE
`;
	fs.writeFileSync(path.join(TYPESCRIPT_LIB_DESTINATION, 'typescriptServices.d.ts'), dtsServices);
});

/**
 * Import a lib*.d.ts file from TypeScript's dist
 */
function importLibDeclarationFile(name) {
	var dstName = name.replace(/\.d\.ts$/, '').replace(/\./g, '-') + '-ts';
	var srcPath = path.join(TYPESCRIPT_LIB_SOURCE, name);

	var contents = fs.readFileSync(srcPath).toString();

	var dstPath1 = path.join(TYPESCRIPT_LIB_DESTINATION, dstName + '.js');
	fs.writeFileSync(dstPath1,
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// This is a generated file from ${name}

define([], function() { return { contents: "${escapeText(contents)}"}; });

`);

	var dstPath2 = path.join(TYPESCRIPT_LIB_DESTINATION, dstName + '.d.ts');
	fs.writeFileSync(dstPath2,
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export declare var contents: string;
`);
}

/**
 * Escape text such that it can be used in a javascript string enclosed by double quotes (")
 */
function escapeText(text) {
	// http://www.javascriptkit.com/jsref/escapesequence.shtml
	// \b	Backspace.
	// \f	Form feed.
	// \n	Newline.
	// \O	Nul character.
	// \r	Carriage return.
	// \t	Horizontal tab.
	// \v	Vertical tab.
	// \'	Single quote or apostrophe.
	// \"	Double quote.
	// \\	Backslash.
	// \ddd	The Latin-1 character specified by the three octal digits between 0 and 377. ie, copyright symbol is \251.
	// \xdd	The Latin-1 character specified by the two hexadecimal digits dd between 00 and FF.  ie, copyright symbol is \xA9.
	// \udddd	The Unicode character specified by the four hexadecimal digits dddd. ie, copyright symbol is \u00A9.
	var _backspace = '\b'.charCodeAt(0);
	var _formFeed = '\f'.charCodeAt(0);
	var _newLine = '\n'.charCodeAt(0);
	var _nullChar = 0;
	var _carriageReturn = '\r'.charCodeAt(0);
	var _tab = '\t'.charCodeAt(0);
	var _verticalTab = '\v'.charCodeAt(0);
	var _backslash = '\\'.charCodeAt(0);
	var _doubleQuote = '"'.charCodeAt(0);

	var startPos = 0, chrCode, replaceWith = null, resultPieces = [];

	for (var i = 0, len = text.length; i < len; i++) {
		chrCode = text.charCodeAt(i);
		switch (chrCode) {
			case _backspace:
				replaceWith = '\\b';
				break;
			case _formFeed:
				replaceWith = '\\f';
				break;
			case _newLine:
				replaceWith = '\\n';
				break;
			case _nullChar:
				replaceWith = '\\0';
				break;
			case _carriageReturn:
				replaceWith = '\\r';
				break;
			case _tab:
				replaceWith = '\\t';
				break;
			case _verticalTab:
				replaceWith = '\\v';
				break;
			case _backslash:
				replaceWith = '\\\\';
				break;
			case _doubleQuote:
				replaceWith = '\\"';
				break;
		}
		if (replaceWith !== null) {
			resultPieces.push(text.substring(startPos, i));
			resultPieces.push(replaceWith);
			startPos = i + 1;
			replaceWith = null;
		}
	}
	resultPieces.push(text.substring(startPos, len));
	return resultPieces.join('');
}
