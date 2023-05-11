import { useState, useEffect } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { Trash, ClipboardPlus, Eye } from 'react-bootstrap-icons';
import API from './API.js';
import { ModaleNuovo, ModaleDettaglio } from './ModaleMeme.js';

function ListMeme(props) {
    const { setMemes, setDirty, dirty, loggedIn } = props;
    useEffect(() => {
        const getMemes = async () => {
            let memes;
            if (loggedIn) {
                memes = await API.getAllMemes();
            } else {
                memes = await API.getPublicMemes();
            }
            setMemes(memes);
            setDirty(false);
        };
        if (dirty) {
            getMemes();
        }
    }, [dirty, setMemes, setDirty, loggedIn]);
    //se non aggiungiamo setMemes, setDirty, alle dipendenze, c'è un errore di missing dependencies della useEffect

    return (
        <>
            {dirty ? <><Row>
                <Col xs={3}>

                </Col>
                <Col xs={9} className="pt-3" >
                    <h3>🕗 Please wait, loading your memes... 🕗</h3>
                </Col>
            </Row></> :
                <ListGroup variant="flush" className="width100">
                    <Row>
                        <Col xs={4} className="pt-3"><h3>TITOLO MEME</h3></Col>
                        <Col xs={4} className="pt-3"><h3>CREATORE</h3></Col>
                        <Col xs={4} className="pt-3"><h3>AZIONI</h3></Col>
                    </Row>
                    {props.memes.map(meme =>//forse mettere qui id_meme
                        <ListItemMeme key={meme.id_meme} meme={meme} deleteMeme={props.deleteMeme} creaMeme={props.creaMeme} setMessage={props.setMessage} loggedIn={props.loggedIn} />
                    )}
                </ListGroup>
            }
        </>
    );
}

function ListItemMeme(props) {
    const [modalDettaglio, setModalDettaglio] = useState(false);
    const [modalNuovo, setModalNuovo] = useState(false);

    return (
        <ListGroup.Item>
            <Row>
                <Col xs={4}>{props.meme.titolo}</Col>
                <Col xs={4}>{props.meme.nome}</Col>
                <Col xs={1}>
                    <Eye size={20} fill="red" className="pointer" onClick={() => { setModalDettaglio(true) }} />
                    <ModaleDettaglio
                        show={modalDettaglio}
                        onHide={() => setModalDettaglio(false)}
                        meme={props.meme}
                        loggedIn={props.loggedIn}
                        isDettaglio={true}
                    />
                </Col>
                {props.loggedIn && <Col xs={1}>
                    <ClipboardPlus size={20} fill="red" className="pointer" onClick={() => { setModalNuovo(true) }} />
                    <ModaleNuovo
                        show={modalNuovo}
                        onHide={() => setModalNuovo(false)}
                        meme={props.meme}
                        creaMeme={props.creaMeme}
                    />
                </Col>}
                {props.meme.isCreatore && props.loggedIn && <Col xs={1}>
                    <Trash size={20} fill="red" className="pointer" onClick={() => { props.deleteMeme(props.meme.id_meme) }} />
                </Col>}
            </Row>
        </ListGroup.Item>
    );
}

export default ListMeme;