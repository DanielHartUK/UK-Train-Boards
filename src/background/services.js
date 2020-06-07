import { openDb, dbKeyValue } from './db';

const Rail = require('national-rail-darwin-promises');

class Services {
  constructor() {
    openDb()
      .then(async (db) => {
        const { apiKey } = dbKeyValue(await db.all('SELECT * FROM Settings WHERE key="apiKey"'));
        this.rail = new Rail(apiKey);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  static #processServices(result) {
    let services = [];
    const serviceTypes = ['trainServices', 'busServices', 'ferryServices'];

    serviceTypes.forEach((type) => {
      if (result?.[type]) {
        const typeServices = result[type];
        services = services.concat(typeServices);
      }
    });

    return services;
  }

  getDepartures(crs) {
    return new Promise((resolve, reject) => {
      this.rail.getDepartureBoard(crs, {})
        .then((res) => {
          console.log(res);
          resolve(Services.#processServices(res));
        })
        .catch((error) => {
          console.error(error.response);
          reject(error);
        });
    });
  }
}

export default Services;
