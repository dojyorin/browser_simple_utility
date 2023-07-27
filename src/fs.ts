/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="dom"/>
/// <reference lib="dom.iterable"/>

import {type FileInit, DataType, blobConvert} from "../deps.ts";

interface FilePickerOption{
    excludeAcceptAllOption?: boolean;
    types?: {
        description?: string;
        accept?: Record<string, string>;
    }[];
}

interface DirectoryPickerOption{
    id?: number;
    mode?: "read" | "readwrite";
    startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";
}

declare global{
    function showOpenFilePicker(option?:FilePickerOption): Promise<FileSystemFileHandle[]>;
    function showSaveFilePicker(option?:FilePickerOption): Promise<FileSystemFileHandle>;
    function showDirectoryPicker(option?:DirectoryPickerOption): Promise<FileSystemDirectoryHandle>;
}

/**
* Extract data from file input interface.
* @example
* ```ts
* const element = document.getElementById("input-file");
* const files = await fileList(element);
* ```
*/
export async function fileList(input:File[] | FileList | HTMLInputElement):Promise<FileInit[]>{
    const files:FileInit[] = [];

    for(const file of [...input instanceof HTMLInputElement ? input.files ?? [] : input]){
        files.push([
            file.name,
            new Uint8Array(await file.arrayBuffer())
        ]);
    }

    return files;
}

/**
* Generate `<input>` elements in JavaScript and read files without appending to real DOM.
* @example
* ```ts
* const files = await fsRead();
* ```
*/
export async function fsRead(multiple?:boolean, accept?:string):Promise<FileInit[]>{
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple ?? false;
    input.accept = accept ?? "";

    const list = await new Promise<FileList | null>((done)=>{
        input.oninput = () => done(input.files);
        input.click();
    });

    if(!list){
        throw new ReferenceError();
    }

    return await fileList(list);
}

/**
* Generate `<a download>` elements in JavaScript and write file without appending to real DOM.
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
export async function fsNativeDirectory(option?:DirectoryPickerOption){
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
export async function fsNativeFile(save?:boolean, option?:FilePickerOption):Promise<FileSystemFileHandle>{
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
export async function fsNativeRead<T extends keyof DataType>(fsf:FileSystemFileHandle, type:T):Promise<DataType[T]>{
    return await blobConvert(await fsf.getFile(), type);
}

/**
* Write file given native filesystem handle.
* @example
* ```ts
* const fsf = await fsNativeFile(true);
* await fsNativeWrite(fsf, "my-text");
* ```
*/
export async function fsNativeWrite(fsf:FileSystemFileHandle, data:FileSystemWriteChunkType):Promise<void>{
    const sw = await fsf.createWritable();

    await sw.write(data);
    await sw.close();
}