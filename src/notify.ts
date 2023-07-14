/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="dom"/>
/// <reference lib="dom.iterable"/>

export function dialogNotify(message:string, color:number):void{
    if(0x00FFFFFF < color){
        throw new RangeError();
    }

    const dialog = document.createElement("dialog");
    dialog.style.position = "fixed";
    dialog.style.zIndex = "255";
    dialog.style.top = "16px";
    dialog.style.padding = "8px 16px";
    dialog.style.maxWidth = "calc(100dvw - 20px)";
    dialog.style.border = "0";
    dialog.style.borderRadius = "8px";
    dialog.style.fontSize = "16px";
    dialog.style.backgroundColor = `#${color.toString(16).padStart(6, "0")}`;
    dialog.style.boxShadow = "0 2px 4px 0 #000000";
    dialog.style.overflowWrap = "break-word";
    dialog.textContent = message;
    dialog.show();

    setTimeout(() => dialog.remove(), 5000);
    document.body.appendChild(dialog);
}