import { Navbar, Col } from 'react-bootstrap';
import { PersonCircle, Check2All } from 'react-bootstrap-icons';
import { LogoutButton, LoginButton } from './Login.js';

function NavbarCustom(props) {
    return (
        <Navbar bg="success" variant="dark" expand="lg">
            <Col className="d-flex align-items-center" >
                <Check2All size={30} color="white" className="mr-1" />
                <Navbar.Brand href="/">Meme generator</Navbar.Brand>
            </Col>
            <Col className="d-flex align-items-center" />
            <Col className="d-flex justify-content-end align-items-center" >
                <p className="pt-2" style={{ color: "white" }}>{props.nomeUtente}</p>
                {props.loggedIn && <PersonCircle size={30} color="white" className="mr-3 ml-3" />}
                {props.loggedIn ? <LogoutButton logout={props.doLogOut} /> : <LoginButton />}
            </Col>
        </Navbar>
    );
}

export default NavbarCustom;