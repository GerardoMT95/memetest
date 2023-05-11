const BASEURL = '/api';


async function getAllMemes() {
    // call: GET /api/AllMemes
    const response = await fetch(BASEURL + '/AllMemes');
    const memesJson = await response.json();
    if (response.ok) {
        return memesJson;
    } else {
        throw memesJson;  // An object with the error coming from the server
    }
}

async function getPublicMemes() {
    // call: GET /api/PublicMemes
    const response = await fetch(BASEURL + '/PublicMemes');
    const memesJson = await response.json();
    if (response.ok) {
        return memesJson;
    } else {
        throw memesJson;  // An object with the error coming from the server
    }
}

async function getTipiMeme() {
    // call: GET /api/getTipiMeme
    const response = await fetch(BASEURL + '/GetTipiMeme');
    const memesJson = await response.json();
    if (response.ok) {
        return memesJson;
    } else {
        throw memesJson;  // An object with the error coming from the server
    }
}

function deleteMeme(id) {
    // call: DELETE /api/meme/<id>
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/meme/' + id, {
            method: 'DELETE',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

function creaMeme(meme) {
    // call: POST /api/creaMeme
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/creaMeme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { idTipoMeme: meme.idTipoMeme, titolo: meme.titolo, textTop: meme.textTop, textMid: meme.textMid, textBottom: meme.textBottom, pubblico: meme.pubblico, colore: meme.colore, font: meme.font }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

const API = { getAllMemes, getPublicMemes, logIn, logOut, getUserInfo, deleteMeme, creaMeme, getTipiMeme };
export default API;