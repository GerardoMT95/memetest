'use strict';
/* Data Access Object (DAO) module for accessing Memes */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('meme.db', (err) => {
    if (err) {
        throw err;
    }
});


// get all memes
exports.getAllMemes = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT m.id_meme, m.id_tipo_meme, m.id_utente_creatore, m.titolo, m.text_top, m.text_mid, m.text_bottom, m.pubblico, m.colore, m.font, tm.flag_top, tm.flag_mid, tm.flag_bottom, tm.path, u.nome FROM meme m INNER JOIN utenti u on u.id_utente = m.id_utente_creatore INNER JOIN tipo_meme tm on tm.id_tipo_meme = m.id_tipo_meme ';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const memes = rows.map((r) =>
                ({ id_meme: r.id_meme, id_tipo_meme: r.id_tipo_meme, id_utente_creatore: r.id_utente_creatore, titolo: r.titolo, text_top: r.text_top, text_mid: r.text_mid, text_bottom: r.text_bottom, pubblico: r.pubblico, colore: r.colore, font: r.font, flag_top: r.flag_top, flag_mid: r.flag_mid, flag_bottom: r.flag_bottom, path: r.path, nome: r.nome, isCreatore: r.id_utente_creatore == userId ? true : false }));
            resolve(memes);
        });
    });
};

// get all public memes
exports.getPublicMemes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT m.id_meme, m.id_tipo_meme, m.id_utente_creatore, m.titolo, m.text_top, m.text_mid, m.text_bottom, m.pubblico, m.colore, m.font, tm.flag_top, tm.flag_mid, tm.flag_bottom, tm.path, u.nome FROM meme m INNER JOIN utenti u on u.id_utente = m.id_utente_creatore INNER JOIN tipo_meme tm on tm.id_tipo_meme = m.id_tipo_meme WHERE m.pubblico = 1';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

// get all tipi memes
exports.getTipiMeme = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id_tipo_meme, nome, path, flag_top, flag_mid, flag_bottom FROM tipo_meme ORDER BY id_tipo_meme';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

// delete an existing meme
exports.deleteMeme = (id, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM meme WHERE id_meme = ? AND id_utente_creatore = ?';
        db.run(sql, [id, userId], function (err) {
            if (err) {
                reject(err);
                return;
            } else {
                if (this.changes === 0) {
                    resolve({ errors: 'Impossibile cancellare meme non propri.' });
                }
                resolve(null);
            }
        });
    });
}

// add a new Meme
exports.creaMeme = (meme) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO meme (id_tipo_meme, id_utente_creatore, titolo, text_top, text_mid, text_bottom, pubblico, colore, font) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.run(sql, [meme.idTipoMeme, meme.userId, meme.titolo, meme.textTop, meme.textMid, meme.textBottom, meme.pubblico, meme.colore, meme.font], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(1);
        });
    });
};