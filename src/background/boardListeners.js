import Services from './services';

const { ipcMain } = require('electron');

ipcMain.on('departures', async (e, crs) => {
  let reply;
  const code = crs.toUpperCase();

  Services.getDepartures(code)
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

  Services.getArrivals(code)
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
