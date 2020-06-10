import { openDb } from './db';

const { ipcMain } = require('electron');

class Settings {
  static async getSettings() {
    const db = await openDb();
    let settings = await db.all('SELECT * FROM Settings');

    settings = settings.reduce((obj, item) => {
      obj[item.key] = item.value; // eslint-disable-line no-param-reassign
      return obj;
    }, {});

    return settings;
  }

  static async setSettings(fields) {
    const db = await openDb();
    const stmt = await db.prepare('UPDATE Settings SET value = (?) WHERE key = (?)');
    Object.keys(fields)
      .forEach((key) => {
        stmt.run(fields[key], key);
      });
    await stmt.finalize();
  }
}

async function getSettings(ipcMainEvent) {
  let reply;
  try {
    reply = await Settings.getSettings();
  } catch (error) {
    ipcMainEvent.reply('get-settings', { error: 'Failed to get settings' });
    throw new Error(error);
  }

  ipcMainEvent.reply('get-settings', reply);
}

ipcMain.on('save-settings', async (e, form) => {
  await Settings.setSettings(form);
  await getSettings(e);
});

ipcMain.on('get-settings', async (e) => {
  await getSettings(e);
});
