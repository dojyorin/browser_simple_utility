/**
* Shortcut for `getElementById()` and non nullable.
* @example
* ```ts
* const element = docI("my-text-area");
* ```
*/
export function docI(id:string):Element{
    const e = document.getElementById(id);

    if(!e){
        throw new Error();
    }

    return e;
}

/**
* Shortcut for `getElementsByName()` and converted from `NodeList` to `Element[]`.
* @example
* ```ts
* const elements = docN("my-text-area");
* ```
*/
export function docN(name:string):Element[]{
    return [...document.getElementsByName(name)];
}

/**
* Shortcut for `getElementsByClassName()` and converted from `HTMLCollection` to `Element[]`.
* @example
* ```ts
* const elements = docC("my-text-area");
* ```
*/
export function docC(name:string):Element[]{
    return [...document.getElementsByClassName(name)];
}

/**
* Get currently active element (`.checked === true`) among grouped radio buttons.
* @example
* ```ts
* const element = radioActive("my-radio");
* ```
*/
export function radioActive(name:string):Element | undefined{
    return docN(name).find(e => e instanceof HTMLInputElement && e.type === "radio" && e.checked);
}