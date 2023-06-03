const btn = document.getElementById('openPDFFile');
const pdfPathElement = document.getElementById('pdfFilePath');
const fileInfoTxt = document.getElementById('pdfFileInfo');

btn.addEventListener('click', async () => {
    const data = await window.electronAPI.openFile();
    pdfPathElement.innerText = data;
    const fileMeta = await window.electronAPI.fileInfo();
    fileInfoTxt.innerText = `Page count: ${fileMeta[0]}, Author: ${fileMeta[1]}`;
})