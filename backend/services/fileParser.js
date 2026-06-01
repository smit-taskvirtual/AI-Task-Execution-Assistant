const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const XLSX = require("xlsx");

async function extractPdf(filePath) {
  const buffer = fs.readFileSync(filePath);

  const data = await pdf(buffer);

  return data.text;
}

async function extractDocx(filePath) {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return result.value;
}

async function extractExcel(filePath) {
  const workbook = XLSX.readFile(filePath);

  let extractedText = "";

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];

    const jsonData =
      XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

    extractedText += `\n\n=== SHEET: ${sheetName} ===\n`;

    jsonData.forEach((row) => {
      extractedText += row.join(" | ") + "\n";
    });
  });

  return extractedText;
}

async function extractTxt(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

async function extractText(filePath, mimeType) {
  try {
    // PDF
    if (mimeType === "application/pdf") {
      return await extractPdf(filePath);
    }

    // DOCX
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await extractDocx(filePath);
    }

    // XLSX
    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType.includes("excel") ||
      mimeType.includes("spreadsheet")
    ) {
      return await extractExcel(filePath);
    }

    // TXT
    if (mimeType === "text/plain") {
      return await extractTxt(filePath);
    }

    return `Unsupported file type: ${mimeType}`;
  } catch (error) {
    console.error("File Parsing Error:", error);

    return `Error parsing file: ${error.message}`;
  }
}

module.exports = {
  extractText,
};