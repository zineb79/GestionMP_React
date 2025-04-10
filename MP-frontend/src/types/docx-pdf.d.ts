declare module 'docx-pdf' {
    interface Options {
        format?: string;
        margins?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
    }

    function convert(input: string, output: string, options?: Options): Promise<void>;

    export = convert;
}
