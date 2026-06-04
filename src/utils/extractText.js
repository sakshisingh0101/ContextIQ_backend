// import fs from "fs/promises";
// // import * as pdf from "pdf-parse";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);

// const pdf = require("pdf-parse");
// console.log(pdf);
// console.log(typeof pdf);
// export const extractText = async(file)=>{

//     if(file.mimetype==="text/plain")
//     {
//         return await fs.readFile(
//             file.path,
//             "utf-8"
//         );
//     }

//     if(file.mimetype==="application/pdf")
//     {
//         const dataBuffer=await fs.readFile(
//             file.path
//         );

//         const parsed=await pdf(dataBuffer);

//         return parsed.text;
//     }

//     throw new Error("Unsupported file type");

// }
import fs from "fs/promises";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const pdfModule = require("pdf-parse");

export const extractText = async(file)=>{

    if(file.mimetype==="text/plain")
    {
        return await fs.readFile(
            file.path,
            "utf-8"
        );
    }

    if(file.mimetype==="application/pdf")
    {
        const dataBuffer = await fs.readFile(
            file.path
        );

        const parser = new pdfModule.PDFParse({
            data: dataBuffer
        });

        const parsed = await parser.getText();

        return parsed.text;
    }

    throw new Error("Unsupported file type");
}