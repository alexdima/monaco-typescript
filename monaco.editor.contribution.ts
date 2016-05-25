/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

declare var define;
declare var require;

define(function() {
	monaco.languages.register({
		id: 'typescript',
		extensions: ['.ts'],
		aliases: ['TypeScript', 'ts', 'typescript'],
		mimetypes: ['text/typescript']
	});

	monaco.languages.register({
		id: 'javascript',
		extensions: ['.js', '.es6'],
		firstLine: '^#!.*\\bnode',
		filenames: ['jakefile'],
		aliases: ['JavaScript', 'javascript', 'js'],
		mimetypes: ['text/javascript'],
	});

	let modeLoaded = false;
	let loadMode = () => {
		if (modeLoaded) {
			return;
		}
		modeLoaded = true;
		require(['vs/language/monaco-typescript/out/mode'], function() {});
	};

	monaco.languages.onLanguage('typescript', loadMode);
	monaco.languages.onLanguage('javascript', loadMode);
});
