declare module "pdf-parse" {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }

  interface PDFOptions {
    version?: string;
    max?: number;
  }

  function PDFParse(
    dataBuffer: Buffer | Uint8Array,
    options?: PDFOptions
  ): Promise<PDFData>;

  export = PDFParse;
}
