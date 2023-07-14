/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="dom"/>
/// <reference lib="dom.iterable"/>

import {type FileInit, base64Encode} from "../deps.ts";

export interface FilePickerOption{
    excludeAcceptAllOption?: boolean;
    types?: {
        description?: string;
        accept?: Record<string, string>;
    }[];
}

export interface DirectoryPickerOption{
    id?: number;
    mode?: "read" | "readwrite";
    startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";
}

export interface FileType{
    "blob": Blob;
    "byte": Uint8Array;
    "buffer": ArrayBuffer;
    "text": string;
    "base64": string;
}

declare global{
    function showOpenFilePicker(option?:FilePickerOption): Promise<FileSystemFileHandle[]>;
    function showSaveFilePicker(option?:FilePickerOption): Promise<FileSystemFileHandle>;
    function showDirectoryPicker(option?:DirectoryPickerOption): Promise<FileSystemDirectoryHandle>;
}

export async function fileInit(input:File[]|FileList|HTMLInputElement):Promise<FileInit[]>{
    return await Promise.all([...input instanceof HTMLInputElement ? input.files ?? [] : input].map(async f => [f.name, new Uint8Array(await f.arrayBuffer())]));
}

export async function fsRead(multiple?:boolean, accept?:string):Promise<File[]>{
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple ?? false;
    input.accept = accept ?? "";

    return await new Promise<File[]>((resolve)=>{
        input.oninput = () => resolve([...input.files ?? []]);
        input.click();
    });
}

export function fsWrite(name:string, body:BlobPart):void{
    const anchor = document.createElement("a");
    anchor.download = name;
    anchor.href = URL.createObjectURL(new Blob([body]));

    anchor.click();

    URL.revokeObjectURL(anchor.href);
}

export async function fsNativeOpen(save?:boolean, option?:FilePickerOption):Promise<FileSystemFileHandle>{
    const [fs] = save ? [await showSaveFilePicker(option)] : await showOpenFilePicker(option);

    return fs;
}

export async function fsNativeRead<T extends keyof FileType>(fs:FileSystemFileHandle, type:T):Promise<FileType[T]>{
    const file = await fs.getFile();

    switch(type){
        case "blob": return <FileType[T]>new Blob([file]);
        case "byte": return <FileType[T]>new Uint8Array(await file.arrayBuffer());
        case "buffer": return <FileType[T]>await file.arrayBuffer();
        case "text": return <FileType[T]>await file.text();
        case "base64": return <FileType[T]>base64Encode(new Uint8Array(await file.arrayBuffer()));
        default: throw new Error();
    }
}

export async function fsNativeWrite(fs:FileSystemFileHandle, data:FileSystemWriteChunkType):Promise<void>{
    const w = await fs.createWritable();

    await w.write(data);
    await w.close();
}

export async function fsDirectoryNative(){
    const fs = await showDirectoryPicker();

    return {
        fs: fs
    };
}