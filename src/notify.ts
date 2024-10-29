/**
* Display fixed toast at top of screen.
* Default display time is 5000ms.
* @example
* ```ts
* dialogNotify("Complete!", "green");
* ```
*/
export function dialogNotify(message: string, color: string, time?: number): void {
    const dialog = document.createElement("dialog");
    dialog.textContent = message;

    const style = document.createElement("style");
    style.textContent = /*css*/`
        @scope {
            & {
                position: fixed;
                z-index: 255;
                top: 20px;
                padding: 8px 16px;
                max-width: calc(100dvw - 20px);
                outline: none;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                background-color: ${color};
                box-shadow: 0 2px 4px 0 #000000;
                overflow-wrap: break-word;
            }
        }
    `;

    dialog.appendChild(style);
    document.body.appendChild(dialog);

    setTimeout(() => dialog.remove(), time ?? 5000);

    dialog.show();
}