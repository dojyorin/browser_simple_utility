/**
* Show notification at top of screen.
* Default lifetime is 5000ms.
* @example
* ```ts
* showNotify("Complete!", "green");
* ```
*/
export function showNotify(message: string, color: string, time?: number): void {
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

/**
* Show loading circle modally.
* Insert into DOM with factory function and control on/off with returned function.
* @example
* ```ts
* const showLoading = factoryLoading("blue");
* showLoading(true);
* ```
*/
export function factoryLoading(color: string): (enable: boolean) => void {
    const dialog = document.createElement("dialog");
    const style = document.createElement("style");
    style.textContent = /*css*/`
        @scope {
            @keyframes loading {
                to {
                    transform: rotate(1turn);
                }
            }

            & {
                padding: 8px;
                height: 80px;
                aspect-ratio: 1;
                outline: none;
                border: none;
                border-radius: 50%;
                background-color: ${color};
                mask: conic-gradient(transparent 30%, #000000), linear-gradient(#000000 0 0) content-box;
                mask-composite: subtract;
                animation: loading 1s infinite linear;

                &::backdrop {
                    background-color: #000000A0;
                }
            }
        }
    `;

    dialog.appendChild(style);
    document.body.appendChild(dialog);

    return enable => enable ? dialog.showModal() : dialog.close();
}