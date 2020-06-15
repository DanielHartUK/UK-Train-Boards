import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const { app } = require('electron');
const path = require('path');

export async function openDb() {
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

export function dbKeyValue(rows) {
  const res = {};
  rows.forEach((el) => {
    res[el.key] = el.value;
  });
  return res;
}
