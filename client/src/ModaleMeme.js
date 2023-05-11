import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'

function ModaleDettaglio(props) {
    const { show, ...rest } = props;

    return (

        <Modal
            show={show}
            onHide={rest.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Dettaglio Meme
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <MemeForm {...rest} />
            </Modal.Body>
        </Modal>
    );
}

function ModaleNuovo(props) {
    const { show, ...rest } = props;

    return (
        <Modal
            show={show}
            onHide={rest.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.isNuova ? 'Nuovo Meme' : 'Copia Meme '}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NuovoMemeForm {...rest} />
            </Modal.Body>
        </Modal>
    );
}


function MemeForm(props) {
    return (
        <Form >
            <Row>
                <Col xs={props.loggedIn ? 5 : 6}>
                    <Form.Group controlId='titolo'>
                        <Form.Label>Titolo</Form.Label>
                        <Form.Control type='text' disabled="disabled" value={props.meme.titolo} />
                    </Form.Group>
                </Col>
                {props.loggedIn && <Col xs={2}>
                    <Form.Group controlId="colore">
                        <Form.Label>Colore</Form.Label>
                        <Form.Control as="select" disabled="disabled" value={props.meme.colore} >
                            <option value='black'>Black</option>
                            <option value='white'>White</option>
                            <option value='red'>Red</option>
                            <option value='green'>Green</option>
                            <option value='blue'>Blue</option>
                            <option value='yellow'>Yellow</option>
                        </Form.Control>
                    </Form.Group>
                </Col>}
                {props.loggedIn && <Col xs={2}>
                    <Form.Group controlId="font">
                        <Form.Label>Font</Form.Label>
                        <Form.Control as="select" disabled="disabled" value={props.meme.font} >
                            <option value='arial'>Arial</option>
                            <option value='georgia'>Georgia</option>
                        </Form.Control>
                    </Form.Group>
                </Col>}
                <Col xs={props.loggedIn ? 3 : 6}>
                    <Form.Group controlId='creatore'>
                        <Form.Label>Creatore</Form.Label>
                        <Form.Control type='text' disabled="disabled" value={props.meme.nome} />
                    </Form.Group>
                </Col>
                <Col xs={props.loggedIn ? 2 : 3}>
                    {props.loggedIn && <Form.Group controlId="pubblico">
                        <Form.Label>Pubblico</Form.Label>
                        <Form.Control as="select" disabled="disabled" value={props.meme.pubblico} >
                            <option value='1'>Si</option>
                            <option value='0'>No</option>
                        </Form.Control>
                    </Form.Group>}
                    {props.loggedIn && <Form.Group controlId="tipoMeme">
                        <Form.Label>Tipo Meme</Form.Label>
                        <Form.Control as="select" disabled="disabled" value={props.meme.idTipoMeme} >
                            <option value='1'>Brain</option>
                            <option value='2'>Fry</option>
                            <option value='3'>Homer</option>
                            <option value='4'>Sponge</option>
                            <option value='5'>Toys</option>
                            <option value='6'>Cry</option>
                        </Form.Control>
                    </Form.Group>}
                </Col>
                <Col xs={5}>
                    {props.meme.flag_top === 1 && <p style={{ fontFamily: props.meme.font, color: props.meme.colore, top: '40%', position: 'fixed' }}>{props.meme.text_top}</p>}
                    {props.meme.flag_mid === 1 && <p style={{ fontFamily: props.meme.font, color: props.meme.colore, top: '55%', position: 'fixed' }}>{props.meme.text_mid}</p>}
                    {props.meme.flag_bottom === 1 && <p style={{ fontFamily: props.meme.font, color: props.meme.colore, top: '75%', position: 'fixed' }}>{props.meme.text_bottom}</p>}
                    <Image src={props.meme.path} className="meme_img" alt="meme" height="300px" width="300px" />
                </Col>
                <Col xs={5}>
                    {props.loggedIn && props.meme.flag_top === 1 && <Form.Group controlId='textTop'>
                        <Form.Label>Testo superiore</Form.Label>
                        <Form.Control type='text' disabled="disabled" value={props.meme.text_top} />
                    </Form.Group>}
                    {props.loggedIn && props.meme.flag_mid === 1 && <Form.Group controlId='textMid'>
                        <Form.Label>Testo di mezzo</Form.Label>
                        <Form.Control type='text' disabled="disabled" value={props.meme.text_mid} />
                    </Form.Group>}
                    {props.loggedIn && props.meme.flag_bottom === 1 && <Form.Group controlId='textBottom'>
                        <Form.Label>Testo inferiore</Form.Label>
                        <Form.Control type='text' disabled="disabled" value={props.meme.text_bottom} />
                    </Form.Group>}
                </Col>
            </Row>
            <Row>
                <Col xs={11} />
                <Col xs={1}>
                    <Button onClick={() => props.onHide()} type="button" variant="secondary" className="float-right">Close</Button>
                </Col>
            </Row>
        </Form >
    )
}

function NuovoMemeForm(props) {

    const [titolo, setTitolo] = useState(props.meme ? props.meme.titolo : '');
    const [path, setPath] = useState(props.meme ? props.meme.path : props.tipiMemes[0].path);
    const [textTop, setTextTop] = useState(props.meme ? props.meme.text_top : '');
    const [flagTop, setFlagTop] = useState(props.meme ? props.meme.flag_top : props.tipiMemes[0].flag_top);
    const [textMid, setTextMid] = useState(props.meme ? props.meme.text_mid : '');
    const [flagMid, setFlagMid] = useState(props.meme ? props.meme.flag_mid : props.tipiMemes[0].flag_mid);
    const [textBottom, setTextBottom] = useState(props.meme ? props.meme.text_bottom : '');
    const [flagBottom, setFlagBottom] = useState(props.meme ? props.meme.flag_bottom : props.tipiMemes[0].flag_bottom);
    const [pubblico, setPubblico] = useState(props.meme ? props.meme.pubblico : 0);
    const [colore, setColore] = useState(props.meme ? props.meme.colore : 'black');
    const [font, setFont] = useState(props.meme ? props.meme.font : 'arial');
    const [idTipoMeme, setIdTipoMeme] = useState(props.meme ? props.meme.id_tipo_meme : props.tipiMemes[0].id_tipo_meme);
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const meme = {
                idTipoMeme: idTipoMeme,
                titolo: titolo,
                textTop: textTop,
                textMid: textMid,
                textBottom: textBottom,
                pubblico: pubblico,
                colore: colore,
                font: font
            };
            props.creaMeme(meme);
            props.onHide();
        }
        setValidated(true);
    };

    const cambioBase = (id) => {
        setIdTipoMeme(props.tipiMemes[id - 1].id_tipo_meme);
        setPath(props.tipiMemes[id - 1].path)
        setFlagTop(props.tipiMemes[id - 1].flag_top);
        if (props.tipiMemes[id - 1].flag_top === 0)
            setTextTop('');
        setFlagMid(props.tipiMemes[id - 1].flag_mid);
        if (props.tipiMemes[id - 1].flag_mid === 0)
            setTextMid('');
        setFlagBottom(props.tipiMemes[id - 1].flag_bottom);
        if (props.tipiMemes[id - 1].flag_bottom === 0)
            setTextBottom('');
    }

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
                <Col xs={4}>
                    <Form.Group controlId='titolo'>
                        <Form.Label>Titolo</Form.Label>
                        <Form.Control type='text' required value={titolo} onChange={ev => setTitolo(ev.target.value)} />
                    </Form.Group>
                </Col>
                <Col xs={2}>
                    <Form.Group controlId="colore">
                        <Form.Label>Colore</Form.Label>
                        <Form.Control as="select" required value={colore} onChange={ev => setColore(ev.target.value)} >
                            <option value='black'>Black</option>
                            <option value='white'>White</option>
                            <option value='red'>Red</option>
                            <option value='green'>Green</option>
                            <option value='blue'>Blue</option>
                            <option value='yellow'>Yellow</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={2}>
                    <Form.Group controlId="font">
                        <Form.Label>Font</Form.Label>
                        <Form.Control as="select" required value={font} onChange={ev => setFont(ev.target.value)} >
                            <option value='arial'>Arial</option>
                            <option value='georgia'>Georgia</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={2}>
                    <Form.Group controlId="pubblico">
                        <Form.Label>Pubblico</Form.Label>
                        <Form.Control as="select" required disabled={(props.meme != null && !props.meme.isCreatore && pubblico === 0) ? "disabled" : ""} value={pubblico} onChange={ev => setPubblico(ev.target.value)} >
                            <option value='1'>Si</option>
                            <option value='0'>No</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={2}>
                    <Form.Group controlId="tipoMeme">
                        <Form.Label>Tipo Meme</Form.Label>
                        <Form.Control as="select" required disabled={props.isNuova ? "" : "disabled"} value={idTipoMeme} onChange={ev => cambioBase(ev.target.value)} >
                            <option value='1'>Brain</option>
                            <option value='2'>Fry</option>
                            <option value='3'>Homer</option>
                            <option value='4'>Sponge</option>
                            <option value='5'>Toys</option>
                            <option value='6'>Cry</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={1} />
                <Col xs={5}>
                    {(flagTop === 1) && <p style={{ fontFamily: font, color: colore, top: '40%', position: 'fixed' }}>{textTop}</p>}
                    {(flagMid === 1) && <p style={{ fontFamily: font, color: colore, top: '55%', position: 'fixed' }}>{textMid}</p>}
                    {(flagBottom === 1) && <p style={{ fontFamily: font, color: colore, top: '75%', position: 'fixed' }}>{textBottom}</p>}
                    <Image src={path} className="meme_img" alt="meme" height="300px" width="300px" />
                </Col>
                <Col xs={5}>
                    {(flagTop === 1) && <Form.Group controlId='textTop'>
                        <Form.Label>Testo superiore</Form.Label>
                        <Form.Control type='text' disabled={props.isDettaglio ? "disabled" : ""} value={textTop} onChange={ev => setTextTop(ev.target.value)}
                            required={(textTop === null || textTop === '') && (textMid === null || textMid === '') && (textBottom === null || textBottom === '') ? 'required' : ''} />
                    </Form.Group>}
                    {(flagMid === 1) && <Form.Group controlId='textMid'>
                        <Form.Label>Testo di mezzo</Form.Label>
                        <Form.Control type='text' disabled={props.isDettaglio ? "disabled" : ""} value={textMid} onChange={ev => setTextMid(ev.target.value)}
                            required={(textTop === null || textTop === '') && (textMid === null || textMid === '') && (textBottom === null || textBottom === '') ? 'required' : ''} />
                    </Form.Group>}
                    {(flagBottom === 1) && <Form.Group controlId='textBottom'>
                        <Form.Label>Testo inferiore</Form.Label>
                        <Form.Control type='text' disabled={props.isDettaglio ? "disabled" : ""} value={textBottom} onChange={ev => setTextBottom(ev.target.value)}
                            required={(textTop === null || textTop === '') && (textMid === null || textMid === '') && (textBottom === null || textBottom === '') ? 'required' : ''} />
                    </Form.Group>}
                </Col>
            </Row>
            <Row>
                <Col xs={10} />
                <Col xs={1}>
                    {!props.isDettaglio && <Button type="submit" variant="success" className="float-right">Save</Button>}
                </Col>
                <Col xs={1}>
                    <Button onClick={() => props.onHide()} type="button" variant="secondary" className="float-right">Close</Button>
                </Col>
            </Row>
        </Form >
    )
}

export { ModaleDettaglio, ModaleNuovo };