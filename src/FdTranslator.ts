declare let language: [string];
declare let translate_debug: boolean;

export class FdTranslator {
    static _(term: string): string {
        if (language[term]) {
            return language[term];
        } else if (translate_debug) {
            console.log('translate: ' + term);
        }
        return term;
    }
}