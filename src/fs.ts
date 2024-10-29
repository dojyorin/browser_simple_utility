interface DataEntry {
    name: string;
    body: Uint8Array;
}

// for Chromium
if(!Blob.prototype.bytes) {
    Blob.prototype.bytes = async function() {
        return new Uint8Array(await this.arrayBuffer());
    }
}

/**
* Extract binary from file interface.
* @example
* ```ts
* const files = await fsParse(document.getElementById("input-file"));
* ```
*/
export async function fsParse(input: File[] | FileList | HTMLInputElement): Promise<DataEntry[]> {
    return await Array.fromAsync(input instanceof HTMLInputElement ? input.files ?? [] : input, async (v) => {
        return {
            name: v.name,
            body: await v.bytes()
        };
    });
}

/**
* Read files.
* @example
* ```ts
* const files = await fsRead();
* ```
*/
export async function fsRead(multiple?: boolean, accept?: string): Promise<DataEntry[]> {
    return await new Promise((res, rej) => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = multiple ?? false;
        input.accept = accept ?? "";

        input.oninput = () => input.files ? res(fsParse(input)) : rej();
        input.click();
    });
}

/**
* Write file.
* @example
* ```ts
* fsWrite("example.txt", "my-text");
* ```
*/
export function fsWrite(name: string, body: BlobPart): void {
    const anchor = document.createElement("a");
    anchor.download = name;
    anchor.href = URL.createObjectURL(new Blob([body]));

    anchor.click();

    URL.revokeObjectURL(anchor.href);
}