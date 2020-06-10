import { openDb, dbKeyValue } from './db';
import moment from 'moment';

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

  static #sortServices(a, b) {
    return a.scheduled > b.scheduled;
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

    const today = [];
    const tomorrow = [];
    const now = moment();

    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      service.scheduled = service.std || service.sta || 'TBC';
      service.expected = service.etd || service.eta || 'TBC';

      delete service.std;
      delete service.sta;
      delete service.etd;
      delete service.eta;

      if (service.scheduled !== 'TBC') {

        // If expected is a time, use it to decide if the service is today
        const timeRegex = '^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$';
        if (service.expected.match(timeRegex)) {
          if (now.diff(moment(service.scheduled, 'HH:mm'), 'minutes') > 5
            || now.diff(moment(service.expected, 'HH:mm'), 'minutes') > 5) {
            today.push(service);
          } else {
            tomorrow.push(service);
          }
        } else {
          // If service is delayed, or scheduled for a time in the future, add it to today
          if (service.expected === 'Delayed'
            || now.diff(moment(service.scheduled, 'HH:mm'), 'minutes') > 5) {
            today.push(service);
          } else {
            tomorrow.push(service);
          }
        }
      }
    }

    today.sort(this.#sortServices);
    tomorrow.sort(this.#sortServices);
    services = tomorrow.concat(today);

    return services;
  }

  getDepartures(crs) {
    return new Promise((resolve, reject) => {
      this.rail.getDepartureBoard(crs, { rows: 200 })
        .then((res) => {
          resolve(Services.#processServices(res));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getArrivals(crs) {
    return new Promise((resolve, reject) => {
      this.rail.getArrivalsBoard(crs, { rows: 200 })
        .then((res) => {
          resolve(Services.#processServices(res));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default Services;
