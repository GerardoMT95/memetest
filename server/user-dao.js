'use strict';
/* Data Access Object (DAO) module for accessing users */

const bcrypt = require('bcrypt');
const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('meme.db', (err) => {
    if (err) throw err;
});

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE id_utente = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
                const user = { id: row.id_utente, username: row.email, name: row.nome }
                resolve(user);
            }
        });
    });
};

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { id: row.id_utente, username: row.email, name: row.nome };
                // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
                bcrypt.compare(password, row.password).then(result => {
                    if (result)
                        resolve(user);
                    else
                        resolve(false);
                });
            }
        });
    });
};