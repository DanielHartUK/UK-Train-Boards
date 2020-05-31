import Services from './services';

const { ipcMain } = require('electron');

const services = new Services();

ipcMain.on('departures', async (e, crs) => {
  e.reply('departures', await services.getDepartures(crs));
});
