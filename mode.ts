/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {Language, createTokenizationSupport} from './tokenization';
import {LanguageServiceDefaults, typeScriptDefaults, javaScriptDefaults, LanguageServiceMode} from './typescript';
import {WorkerManager} from './workerManager';
import {register} from './languageFeatures';

import IDisposable = monaco.IDisposable;

function setupMode(defaults:LanguageServiceDefaults, modeId:string, language:Language): void {

	let disposables: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const registration = register(
		modeId,
		defaults,
		(first, ...more) => client.getLanguageServiceWorker(...[first].concat(more))
	);
	disposables.push(registration);

	disposables.push(monaco.languages.registerLanguageConfiguration(modeId, richEditConfiguration));

	disposables.push(monaco.languages.registerTokensProvider(modeId, createTokenizationSupport(language)));
}

const richEditConfiguration:monaco.languages.IRichEditConfiguration = {
	wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},

	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],

	onEnterRules: [
		{
			// e.g. /** | */
			beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
			afterText: /^\s*\*\/$/,
			action: { indentAction: monaco.languages.IndentAction.IndentOutdent, appendText: ' * ' }
		},
		{
			// e.g. /** ...|
			beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
			action: { indentAction: monaco.languages.IndentAction.None, appendText: ' * ' }
		},
		{
			// e.g.  * ...|
			beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
			action: { indentAction: monaco.languages.IndentAction.None, appendText: '* ' }
		},
		{
			// e.g.  */|
			beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
			action: { indentAction: monaco.languages.IndentAction.None, removeText: 1 }
		}
	],

	__electricCharacterSupport: {
		docComment: {scope:'comment.doc', open:'/**', lineStart:' * ', close:' */'}
	},

	__characterPairSupport: {
		autoClosingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"', notIn: ['string'] },
			{ open: '\'', close: '\'', notIn: ['string', 'comment'] },
			{ open: '`', close: '`' }
		]
	}
};

setupMode(
	typeScriptDefaults,
	'typescript',
	Language.TypeScript
);

setupMode(
	javaScriptDefaults,
	'javascript',
	Language.EcmaScript5
);
