const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
let loadedPdfDoc;



function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');


}

function drawPDFPreview(doc) {
    // to follow
}

async function handleFileOpen() {
    const { cancelled, filePaths } = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
        filters: [{ name: 'PDF Files', extenstions: ['pdf'] }],
        properties: ['openFile']
    });
    if (!cancelled && filePaths.length > 0) {
        const inputPath = filePaths[0];

        const pdfBytes = fs.readFileSync(inputPath);
        loadedPdfDoc = await PDFDocument.load(pdfBytes);

        return filePaths[0];

    }
}

function getFileInfo() {
    if (!loadedPdfDoc) {
        return null;
    }
    const pageCount = loadedPdfDoc.getPageCount();
    const authorInfo = loadedPdfDoc.getAuthor();
    return [pageCount, authorInfo];

}

app.whenReady().then(() => {
    createWindow();
    ipcMain.handle('dialog:openFile', handleFileOpen);
    ipcMain.handle('pdf:fileInfo', getFileInfo);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })


});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})
