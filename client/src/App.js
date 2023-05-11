import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Row, Col, Container, Alert } from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import NavbarCustom from './NavbarCustom.js';
import { ModaleNuovo } from './ModaleMeme.js';
import { LoginForm } from './Login.js';
import API from './API';
import ListMeme from './ListMeme.js';

function App() {

  const [memes, setMemes] = useState([]);
  const [tipiMemes, setTipiMemes] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [dirty, setDirty] = useState(true);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [nomeUtente, setNomeUtente] = useState('');

  const deleteMeme = (id) => {
    const del = async () => {
      await API.deleteMeme(id);
      setDirty(true);
    };
    del().then(() => setMessage({ msg: 'Meme cancellato con successo.', type: 'success' }))
      .catch(err => handleErrors(err));
    setTimeout(() => {
      setMessage('');
    }, 5000);
  }

  const creaMeme = (meme) => {
    const add = async () => {
      await API.creaMeme(meme);
      setDirty(true);
    };
    add().then(() => setMessage({ msg: 'Meme creato con successo.', type: 'success' }))
      .catch(err => handleErrors(err));
    setTimeout(() => {
      setMessage('');
    }, 5000);
  }

  const handleErrors = (err) => {
    if (err.errors && err.errors[0].msg) {
      setMessage({ msg: err.errors[0].msg + ': ' + err.errors[0].param, type: 'danger' });
    } else if (err.errors) {
      setMessage({ msg: err.errors, type: 'danger' });
    } else {
      setMessage({ msg: err.error, type: 'danger' });
    }
    setDirty(true);
  }

  const doLogIn = async (credentials) => {
    try {
      const u = await API.logIn(credentials);
      setLoggedIn(true);
      setDirty(true);
      setNomeUtente(u.name);
      setMessage({ msg: `Benvenuto ${u.name}!`, type: 'success' });
      const tm = await API.getTipiMeme();
      setTipiMemes(tm);
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setNomeUtente('');
    setLoggedIn(false);
    setDirty(true);
    setMessage({ msg: 'Logout eseguito con successo!', type: 'success' });
    setMemes([]);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  }

  return (

    <Router>
      <Container fluid className="p-0">
        <NavbarCustom loggedIn={loggedIn} nomeUtente={nomeUtente} doLogOut={doLogOut} doLogIn={doLogIn} />
        {message && <Row>
          <Col xs={4}></Col>
          <Col xs={4} className="mt-5">
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Col>
          <Col xs={4}></Col>
        </Row>}
        <Row className="page">
          <Switch>
            <Route path="/login" render={() =>
              <>{loggedIn ? <Redirect to="/" /> :
                <>
                  <Col xs={4} />
                  <Col xs={4} className="mt-5">
                    <LoginForm login={doLogIn} setMessage={setMessage} />
                  </Col>
                  <Col xs={4} />
                </>}
              </>
            } />
            <Route path="/" render={() =>
              <Container>
                <ListMeme
                  loggedIn={loggedIn}
                  memes={memes}
                  setMemes={setMemes}
                  deleteMeme={deleteMeme}
                  creaMeme={creaMeme}
                  dirty={dirty}
                  setDirty={setDirty}
                  setMessage={setMessage}
                />
                {loggedIn && <>
                  <Row>
                    <Col xs={10} />
                    <Col xs={2}>
                      <PlusCircleFill size={40} color="#28a745" onClick={() => { setModalShow(true); setMessage(''); }} className="pointer pt-1" />
                      <ModaleNuovo
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        isNuova={true}
                        creaMeme={creaMeme}
                        tipiMemes={tipiMemes}
                      />
                    </Col>
                  </Row>
                </>}
              </Container>
            } />
          </Switch>
        </Row>
      </Container>
    </Router >
  );
}

export default App;