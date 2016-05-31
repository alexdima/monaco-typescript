/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare namespace monaco.typescript {

	// It now bites us that we make typescriptServices.d.ts
	// an **external** module by appending `export=`

	// import * as ts from './lib/typescriptServices';

	interface DiagnosticsOptions {
		noSemanticValidation?: boolean;
		noSyntaxValidation?: boolean;
	}

	interface Configuration {
		addExtraLib(content: string, filePath?: string): monaco.IDisposable;
		setCompilerOptions(options/*: ts.CompilerOptions*/): void;
		setDiagnosticsOptions(options: DiagnosticsOptions): void;
	}

	const typeScriptDefaults: Configuration;

	const javaScriptDefaults: Configuration;
}
