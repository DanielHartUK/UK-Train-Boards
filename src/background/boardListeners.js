import Services from './services';

const { ipcMain } = require('electron');

const services = new Services();

ipcMain.on('departures', async (e, crs) => {
  let reply;
  const code = crs.toUpperCase();

  services.getDepartures(code)
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

ipcMain.on('arrivals', async (e, crs) => {
  let reply;
  const code = crs.toUpperCase();

  services.getArrivals(code)
    .then((result) => {
      reply = result;
    })
    .catch((err) => {
      const error = err.response?.statusText || err?.message || err;
      reply = { error };
    })
    .finally(() => {
      e.reply('arrivals', reply);
    });
});
