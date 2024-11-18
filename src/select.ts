/**
* Get currently active element (`.checked === true`) among grouped radio buttons.
* @example
* ```ts
* const element = radioActive("my-radio");
* ```
*/
export function radioActive(name: string): HTMLInputElement | undefined {
    for(const element of document.getElementsByName(name)) {
        if(element instanceof HTMLInputElement && element.type === "radio" && element.checked) {
            return element;
        }
    }
}