/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="dom"/>
/// <reference lib="dom.iterable"/>

interface FilePickerOption{
    excludeAcceptAllOption?: boolean;
    types?: {
        description?: string;
        accept?: Record<string, string>;
    }[];
}

export interface OpenFilePickerOption extends FilePickerOption{
    multiple?: boolean;
}

export interface SaveFilePickerOption extends FilePickerOption{
    suggestedName?: string;
}

export interface FileType{
    "blob": Blob;
    "byte": Uint8Array;
    "text": string;
    "base64": string;
}

declare global{
    function showOpenFilePicker(option?:OpenFilePickerOption): Promise<FileSystemFileHandle[]>;
    function showSaveFilePicker(option?:SaveFilePickerOption): Promise<FileSystemFileHandle>;
}

export async function fileInit(input:File[]|FileList|HTMLInputElement){
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

export async function fsNativeRead<T extends keyof FileType>(fs:FileSystemFileHandle, type:T){
    const picker = await showOpenFilePicker();
    const handle = fs instanceof FileSystemFileHandle ? fs : ().shift();
    const file = await handle.getFile();

    return {
        fs: handle,
        data: {
            blob: new Blob([file]),
            buffer: await file.arrayBuffer(),
            text: await file.text(),
            code: await new Promise((res)=>{
                const reader = new FileReader();
                reader.addEventListener("load", () => res(reader.result));
                reader.readAsDataURL(file);
            })
        }[type]
    };
}

export async function fsNativeWrite(fs, data){
    const handle = fs instanceof FileSystemFileHandle ? fs : await showSaveFilePicker(fs);
    const writer = await handle.createWritable();

    await writer.write(data);
    await writer.close();

    return {
        fs: handle
    };
}

async function fsNativeDirectory(){
    const handle = await showDirectoryPicker();

    return {
        fs: handle
    };
}