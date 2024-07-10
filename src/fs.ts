interface DataEntry {
    name: string;
    body: Uint8Array;
}

/**
* Extract data from file interface.
* @example
* ```ts
* const files = await fileList(document.getElementById("input-file"));
* ```
*/
export async function fileList(input: File[] | FileList | HTMLInputElement): Promise<DataEntry[]> {
    const files: DataEntry[] = [];

    for(const file of [...input instanceof HTMLInputElement ? input.files ?? [] : input]) {
        files.push({
            name: file.name,
            body: new Uint8Array(await file.arrayBuffer())
        });
    }

    return files;
}

/**
* Read files.
* @example
* ```ts
* const files = await fsRead();
* ```
*/
export async function fsRead(multiple?: boolean, accept?: string): Promise<DataEntry[]> {
    const file = await new Promise<FileList>((res, rej) => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = multiple ?? false;
        input.accept = accept ?? "";
        input.oninput = () => input.files ? res(input.files) : rej();
        input.click();
    });

    return await fileList(file);
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