import io
from pypdf import PdfReader


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Takes the bytes of a PDF file and returns the extracted text.
    """
    pdf_file = io.BytesIO(file_bytes)
    reader = PdfReader(pdf_file)

    extracted_text = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            extracted_text.append(text)

    return "\n".join(extracted_text).strip()