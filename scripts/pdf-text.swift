import Foundation
import PDFKit

guard CommandLine.arguments.count == 2 else {
  FileHandle.standardError.write(Data("usage: pdf-text.swift FILE\n".utf8))
  exit(2)
}

let url = URL(fileURLWithPath: CommandLine.arguments[1])
guard let document = PDFDocument(url: url), let text = document.string, !text.isEmpty else {
  FileHandle.standardError.write(Data("unable to extract PDF text\n".utf8))
  exit(1)
}

print(text)
