/**
* Simple name and data pair.
*/
interface DataMap{
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
export async function fileList(input:File[] | FileList | HTMLInputElement):Promise<DataMap[]>{
    const files:DataMap[] = [];

    for(const file of [...input instanceof HTMLInputElement ? input.files ?? [] : input]){
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
export async function fsRead(multiple?:boolean, accept?:string):Promise<DataMap[]>{
    const file = await new Promise<FileList>((res, rej)=>{
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
export function fsWrite(name:string, body:BlobPart):void{
    const anchor = document.createElement("a");
    anchor.download = name;
    anchor.href = URL.createObjectURL(new Blob([body]));
    anchor.click();

    URL.revokeObjectURL(anchor.href);
}

/**
* Get directory handle to native filesystem.
* @example
* ```ts
* const fsd = await fsNativeDirectory();
* ```
*/
export async function fsNativeDirectory(option?:DirectoryPickerOptions):Promise<FileSystemDirectoryHandle>{
    const fsd = await showDirectoryPicker(option);

    return fsd;
}

/**
* Get file handle to native filesystem.
* @example
* ```ts
* const fsf = await fsNativeFile();
* ```
*/
export async function fsNativeFile(save?:boolean, option?:FilePickerOptions):Promise<FileSystemFileHandle>{
    const [fsf] = save ? [await showSaveFilePicker(option)] : await showOpenFilePicker(option);

    return fsf;
}

/**
* Read file given native filesystem handle.
* @example
* ```ts
* const fsf = await fsNativeFile();
* const data = await fsNativeRead(fsf, "byte");
* ```
*/
export async function fsNativeRead<T extends "byte" | "text">(fsf:FileSystemFileHandle, type:T):Promise<T extends "byte" ? Uint8Array : T extends "text" ? string : never>{
    const file = await fsf.getFile();

    switch(type){
        case "byte": return <T extends "byte" ? Uint8Array : T extends "text" ? string : never>new Uint8Array(await file.arrayBuffer());
        case "text": return <T extends "byte" ? Uint8Array : T extends "text" ? string : never>await file.text();
        default: throw new Error();
    }
}

/**
* Write file given native filesystem handle.
* @example
* ```ts
* const fsf = await fsNativeFile(true);
* await fsNativeWrite(fsf, "my-text");
* ```
*/
export async function fsNativeWrite(fsf:FileSystemFileHandle, data:string | Uint8Array):Promise<void>{
    const context = await fsf.createWritable();
    await context.write(data);
    await context.close();
}