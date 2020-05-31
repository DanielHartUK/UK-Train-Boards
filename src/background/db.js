import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const { app } = require('electron');
const path = require('path');

export default async function () {
  try {
    const db = await open({
      filename: `${app.getPath('userData')}/db.sqlite`,
      driver: sqlite3.Database,
    });

    await db.migrate({
      migrationsPath: path.join(__static, '/migrations'),
    });

    return db;
  } catch (e) {
    throw new Error(e);
  }
}
