/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="dom"/>
/// <reference lib="dom.iterable"/>

export function $id(id:string):Element{
    const e = document.getElementById(id);

    if(!e){
        throw new ReferenceError();
    }

    return e;
}

export function $nn(name:string):Element[]{
    return [...document.getElementsByName(name)];
}

export function $cn(name:string):Element[]{
    return [...document.getElementsByClassName(name)];
}

export function radioActive(name:string):Element | undefined{
    return $nn(name).find(e => e instanceof HTMLInputElement && e.type === "radio" && e.checked);
}