/**
* Display fixed toast at top of screen.
* Default display time is 5000ms.
* @example
* ```ts
* dialogNotify("Complete!", "green");
* ```
*/
export function dialogNotify(message:string, color:string, time?:number):void{
    const dialog = document.createElement("dialog");
    dialog.style.position = "fixed";
    dialog.style.zIndex = "255";
    dialog.style.top = "16px";
    dialog.style.padding = "8px 16px";
    dialog.style.maxWidth = "calc(100dvw - 20px)";
    dialog.style.border = "0";
    dialog.style.borderRadius = "8px";
    dialog.style.fontSize = "16px";
    dialog.style.backgroundColor = color;
    dialog.style.boxShadow = "0 2px 4px 0 #000000";
    dialog.style.overflowWrap = "break-word";
    dialog.textContent = message;
    dialog.show();

    setTimeout(() => dialog.remove(), time ?? 5000);
    document.body.appendChild(dialog);
}