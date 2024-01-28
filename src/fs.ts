import {type DataMap, blobConvert} from "../deps.ts";

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
            body: await blobConvert(file, "byte")
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
    const file = await new Promise<FileList | null>((res)=>{
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = multiple ?? false;
        input.accept = accept ?? "";
        input.oninput = () => res(input.files);
        input.click();
    });

    if(!file){
        throw new Error();
    }

    return await fileList(file);
}

/**
* Write file.
* @example
* ```ts
* fsWrite("example.txt", "my-text");
* ```
*/
export function fsWrite(name:string, body:string | Uint8Array):void{
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
export async function fsNativeRead<T extends "text" | "byte">(fsf:FileSystemFileHandle, type:T):Promise<T extends "text" ? string : T extends "byte" ? Uint8Array : never>{
    return <T extends "text" ? string : T extends "byte" ? Uint8Array : never>await blobConvert(await fsf.getFile(), type);
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