// this.MonacoPlugins = this.MonacoPlugins || [];
// this.MonacoPlugins.push({
// 	languages: [{
// 		id: 'typescript',
// 		extensions: ['.ts'],
// 		aliases: ['TypeScript', 'ts', 'typescript'],
// 		mimetypes: ['text/typescript']
// 	}],
// 	activate: () => {
// 		// The Monaco API is available at this point
// 		Monaco.Languages.onLanguage('typescript', () => {
// 			console.log('typescript was created!');
// 		});
// 		// console.log('THE EDITOR HAS LOADED');
// 	}
// });

// this.MonacoPlugins = this.MonacoPlugins || [];
// console.log('I AM LOADED!');
define(function() {
	Monaco.Languages.register2({
		id: 'typescript',
		extensions: ['.ts'],
		aliases: ['TypeScript', 'ts', 'typescript'],
		mimetypes: ['text/typescript']
	});

	Monaco.Languages.onLanguage('typescript', () => {
		console.log('TS LOADED!!!');
		require(['vs/language/monaco-typescript/out/mode'], function() {});
	});
});
// Monaco.Languages.registerTokenizationSupport('typescript', tokenization);



// Monaco.Languages.registerTokenizationSupport('typescript', () => {
// 	return new ...
// });

// Monaco.Languages.onLanguage('typescript', () => {
// 	// console.log('typescript was created!');
// });

// window.TsLanguage = Monaco.Language.create({
// 	id: 'typescript',
// 	extensions: ['.ts'],
// 	aliases: ['TypeScript', 'ts', 'typescript'],
// 	mimetypes: ['text/typescript'],
// 	load: () => {
// 		// registerTokenizatioNupport
// 	}
// })

// 	}],
// 	activate: () => {
// 		// The Monaco API is available at this point
// 		// console.log('THE EDITOR HAS LOADED');
// 	}
// });
