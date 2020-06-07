import Services from './services';

const { ipcMain } = require('electron');

const services = new Services();

ipcMain.on('departures', async (e, crs) => {
  let reply;

  services.getDepartures(crs)
    .then((result) => {
      reply = result;
    })
    .catch((err) => {
      const error = err.response?.statusText || err?.message || err;
      reply = { error };
    })
    .finally(() => {
      e.reply('departures', reply);
    });
});
