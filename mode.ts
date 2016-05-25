
import {Language, createTokenizationSupport} from './tokenization';
import {LanguageServiceDefaults, typeScriptDefaults, javaScriptDefaults, LanguageServiceMode} from './typescript';
import {WorkerManager} from './workerManager';
import {register} from './languageFeatures';

import IDisposable = monaco.IDisposable;

function setupMode(defaults:LanguageServiceDefaults, modeId:string, language:Language): void {

	// let disposables: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	// disposables.push(client);

	const registration = register(
		modeId,
		defaults,
		(first, ...more) => client.getLanguageServiceWorker(...[first].concat(more))
	);
	// disposables.push(registration);

	// disposables.push(modeService.registerRichEditSupport(modeId, richEditConfiguration));
    
    
    monaco.languages.registerTokensProvider(modeId, createTokenizationSupport(language));
}

setupMode(
		typeScriptDefaults,
		'typescript',
		Language.TypeScript
	);

	// setupMode(
	// 	modelService,
	// 	markerService,
	// 	modeService,
	// 	javaScriptDefaults,
	// 	'javascript',
	// 	Language.EcmaScript5
	// );