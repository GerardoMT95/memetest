import { Form, Button, } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col} from 'react-bootstrap';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setMessage('');
    const credentials = { username, password };
    let valid = true;
    if (username === '' || !username.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/i) || password === '' || password.length < 6) {
      valid = false;
    }
    if (valid) {
      props.login(credentials);
    }
    else {
      props.setMessage({ msg: 'Email o password non validi.', type: 'danger' })
    }
  };

  return (
    <Form>
      <Form.Group controlId='username'>
        <Form.Label>E-mail</Form.Label>
        <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='password'>
        <Form.Label>Password</Form.Label>
        <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
      </Form.Group>
      <Row>
        <Col xs={3} />
        <Col xs={3}>
          <Button type="submit" variant="success" onClick={handleSubmit}>Login</Button>
        </Col>
        <Col xs={3}>
          <Link to="/"><Button variant="secondary">Home</Button></Link>
        </Col>
      </Row>
    </Form>)
}

function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>Logout</Button>
  )
}

function LoginButton() {
  return (
    <Link to="/login"><Button variant="outline-light" >Login</Button></Link>
  )
}

export { LoginForm, LogoutButton, LoginButton };