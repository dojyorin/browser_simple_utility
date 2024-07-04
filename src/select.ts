/**
* Get currently active element (`.checked === true`) among grouped radio buttons.
* @example
* ```ts
* const element = radioActive("my-radio");
* ```
*/
export function radioActive(name: string): HTMLInputElement | undefined {
    for(const v of document.getElementsByName(name)) {
        if(v instanceof HTMLInputElement && v.type === "radio" && v.checked) {
            return v;
        }
    }
}