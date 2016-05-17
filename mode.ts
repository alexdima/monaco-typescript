
import {Language, createTokenizationSupport} from './tokenization';

Monaco.Languages.registerTokensProvider('typescript', createTokenizationSupport(Language.TypeScript));
