/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {LanguageServiceMode, LanguageServiceDefaults} from './typescript';
import {TypeScriptWorker} from './worker';

import Promise = monaco.Promise;
import IDisposable = monaco.IDisposable;
import Uri = monaco.Uri;

export class WorkerManager {

	private _defaults: LanguageServiceDefaults;
	private _worker: monaco.editor.MonacoWebWorker<TypeScriptWorker>;
	private _client: Promise<TypeScriptWorker>;

	constructor(defaults: LanguageServiceDefaults) {
		this._defaults = defaults;
		this._worker = null;
	}

	private _createClient(): Promise<TypeScriptWorker> {
		// TODO: stop when idle
		this._worker = monaco.editor.createWebWorker<TypeScriptWorker>({
			moduleId: 'vs/language/monaco-typescript/out/worker',
		});

		let configChangeListener: IDisposable = null;

		const stopWorker = () => {
			configChangeListener.dispose();
			this._worker.dispose();
			this._worker = null;
			this._client = null;
		};

		configChangeListener = this._defaults.onDidChange(stopWorker);

		let _client:TypeScriptWorker = null;
		return this._worker.getProxy().then((client) => {
			_client = client;
		}).then(_ => {
			const {compilerOptions, extraLibs} = this._defaults;
			return _client.acceptDefaults(compilerOptions, extraLibs);
		}).then(_ => _client);

		// // stop worker after being idle
		// const handle = setInterval(() => {
		// 	if (Date.now() - client.getLastRequestTimestamp() > 1000 * 60) {
		// 		stopWorker();
		// 	}
		// }, 1000 * 60);
		// this._clientDispose.push({ dispose() { clearInterval(handle); } });

		// // stop worker when defaults change
		// this._clientDispose.push(this._defaults.onDidChange(() => stopWorker()));

		// // send default to worker right away
		// const worker = client.get();
		// const {compilerOptions, extraLibs} = this._defaults;
		// return worker.acceptDefaults(compilerOptions, extraLibs).then(() => ({ worker, manager }));
	}

	dispose(): void {
		console.log('I SHOULD DISPOSE??!?!!?');
	// 	this._clientDispose = dispose(this._clientDispose);
	// 	this._client = null;
	}

	getLanguageServiceWorker(...resources: Uri[]): Promise<TypeScriptWorker> {
		if (!this._client) {
			this._client = this._createClient();
		}

		// create a new promise to avoid cancellation
		return new monaco.Promise((c, e) => {
			this._client.then((data) => {
			return this._worker.withSyncedResources(resources).then(_ => data)
			}).then(c, e);
		}, () => {});
	}
}
