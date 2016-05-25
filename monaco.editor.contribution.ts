declare var define;
declare var require;

define(function() {
	monaco.languages.registerStandaloneLanguage2({
		id: 'typescript',
		extensions: ['.ts'],
		aliases: ['TypeScript', 'ts', 'typescript'],
		mimetypes: ['text/typescript']
	});

	monaco.languages.onLanguage('typescript', () => {
		console.log('TS LOADED!!!');
		require(['vs/language/monaco-typescript/out/mode'], function() {});
	});
});
