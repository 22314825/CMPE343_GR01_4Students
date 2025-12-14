const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');

const dataPath = path.join(app.getPath('userData'), 'data.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
  win.webContents.closeDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// --- Helper Functions ---
async function readData() {
  if (await fs.pathExists(dataPath)) {
    return await fs.readJson(dataPath);
  }
  return [];
}

async function writeData(data) {
  await fs.writeJson(dataPath, data);
}

// --- IPC Handlers ---
ipcMain.on('get-data', async (event) => {
  const data = await readData();
  event.sender.send('data-loaded', data);
});

ipcMain.on('insert-data', async (event, newItem) => {
  const data = await readData();
  data.push(newItem);
  await writeData(data);
  event.sender.send('data-updated', data);
});

ipcMain.on('update-data', async (event, updatedItem) => {
  let data = await readData();
  const index = data.findIndex(d => d.index === updatedItem.index);

  if (index !== -1) {
    data[index].value = updatedItem.value;
    await writeData(data);
    event.sender.send('data-updated', data);
  } else {
    event.sender.send('error-message', 'Index not found for update.');
  }
});

ipcMain.on('delete-data', async (event, indexToDelete) => {
  let data = await readData();

  const filtered = data.filter(d => d.index !== indexToDelete);
  if (filtered.length < data.length) {
    await writeData(filtered);
    event.sender.send('data-updated', filtered);
  } else {
    event.sender.send('error-message', 'Index not found for deletion.');
  }
});
