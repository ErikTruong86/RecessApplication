import React, { Component, createRef } from "react";
import "./CreateAccount.css";
import Menubar from "./MenuBar"
import Environment from "./Environment";
// Bootstrap Components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button';
import StoreSessionKeys from "../StoreSessionKeys";
import { toastr } from 'react-redux-toastr'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import * as Ladda from 'ladda';

class CreateAccount extends Component {

  env;
  laddaButton;

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      preferredName: '',
      email: '',
      birthday: '',
      password: '',
      role: '',
      profilePicture: ''
    };

    this.hiddenFileInput = createRef()
    this.changefirstName = this.changefirstName.bind(this);
    this.changeLastName = this.changeLastName.bind(this);
    this.changePreferredName = this.changePreferredName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeBirthday = this.changeBirthday.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.changeRole = this.changeRole.bind(this);
    this.changeProfilePicture = this.changeProfilePicture.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.env = new Environment();
  }

  changefirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  changeLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  changePreferredName(event) {
    this.setState({ preferredName: event.target.value });
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changeBirthday(event) {
    this.setState({ birthday: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  changeRole(event) {
    this.setState({ role: event.target.value });
  }

  changeProfilePicture(event) {
    var files = document.getElementById('file').files;
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    const scope = this;
    reader.onload = function () {
      scope.setState({ profilePicture: reader.result });
    };
  }

  onButtonClicked(event) {
    this.hiddenFileInput.current.click();
  }

  handleKeyPress(event) {
    //13 is the char code for enter
    if (event.charCode === 13) {
      this.createAccount(event);
    }
  }

  isStaff() {
    return this.state.role.toUpperCase() === "teacher".toUpperCase();
  }

  createAccount(event) {
    event.preventDefault();
    this.laddaButton.start();
    if (this.state.role === "") {
      this.laddaButton.stop();
      toastr.error('Error', "You must select a role to create an account.");
    }
    else {
      var json = JSON.stringify({
        "email_address": this.state.email,
        "first_name": this.state.firstName,
        "last_name": this.state.lastName,
        "preferred_name": this.state.preferredName,
        "password": this.state.password,
        "dob": this.state.birthday,
        "role": this.state.role,
        "photo": this.state.profilePicture,
        "is_staff": this.isStaff(),
        "is_superuser": false
      });
      fetch(this.env.getRootUrl() + "/api-auth/register/", {
        method: "POST",
        body: json,
        headers: {
          "Content-Type": "application/json"
        }
      }).then((resp) => {
        if (resp.status === 200) {
          this.laddaButton.stop();
          resp.json().then((results) => {
            StoreSessionKeys(this, results, "Failed to create account.", '/Profile');
          });
        }
        else {
          this.laddaButton.stop();
          toastr.error('Error', "Failed to create account.\nPlease enter all information.")
        }
      });
    }
  }

  componentDidMount() {
    this.laddaButton = Ladda.create(document.querySelector('#createAccountButton'));
    if (sessionStorage.getItem("refreshToken")) {
      this.props.history.push({
        pathname: '/Calendar'
      });
    }
  }

  // This function is called to check if the 2 passwords match
  function checkPassword(form) {
    password1 = form.password1.value;
    password2 = form.password2.value;
    if(password1 != password2) {
      alert("\n These Password do not match");
      return false;
    }
    else {
      return true;
    }
  }

  render() {
    return (
      <div>
        <Menubar />
        <Container className="background_CA" fluid>
          <Form onSubmit={this.createAccount} onKeyPress={this.handleKeyPress}>
            <Row className="justify-content-md-center">
              <Col md={6} xs={12}>
                <a href="/"> <Image src="./Recess_logo.png" alt={'Recess Logo'} fluid /></a>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col xs={12}>
                <Image src="./signupbanner.png" alt={'Create Account Banner'} fluid />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col md={5} xs={12}>
                <Form.Group controlId="firstNameFormGroup">
                  <Form.Control
                    className="textInput"
                    name="firstName"
                    type="text"
                    placeholder="First Name:"
                    value={this.state.firstName}
                    onChange={this.changefirstName}
                    style={{ height: 64 }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={5} xs={12}>
                <Form.Group controlId="lastNameFormGroup">
                  <Form.Control
                    className="textInput"
                    type="text"
                    name="lastName"
                    placeholder="Last Name:"
                    value={this.state.lastName}
                    onChange={this.changeLastName}
                    style={{ height: 64 }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col md={5} xs={12}>
                <Form.Group controlId="emailCAFormGroup">
                  <Form.Control
                    className="textInput"
                    type="email"
                    placeholder="Email:"
                    value={this.state.email}
                    onChange={this.changeEmail}
                    style={{ height: 64 }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={5} xs={12}>
                <Form.Group controlId="preferredNameFormGroup">
                  <Form.Control
                    className="textInput"
                    name="emailCA"
                    type="text"
                    placeholder="Prefered Name:"
                    value={this.state.prefferedName}
                    onChange={this.changePreferredName}
                    style={{ height: 64 }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col md={5} xs={12}>
                <Form.Group controlId="dateofbirthFormGroup">
                  <Form.Control
                    className="textInput"
                    type="date"
                    name="textInputCA"
                    value={this.state.birthday}
                    onChange={this.changeBirthday}
                    placeholder="Date of Birth"
                    style={{ height: 64 }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={5} xs={12}>
                <Form.Group controlId="passwordFormGroup">
                  <Form.Control
                    className="textInput"
                    name="passwordCA"
                    type="password"
                    placeholder="Password:"
                    value={this.state.password}
                    onChange={this.changePassword}
                    style={{ height: 64 }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col md={5} xs={12}>
                <Form.Group controlId="roleFormGroup">
                  <Form.Control as="select"
                    className="textInput_role"
                    type="text"
                    value={this.state.role}
                    onChange={this.changeRole}
                    style={{ height: 64 }}
                    required
                  >
                    <option value="Role" hidden={this.state.role !== ""}>Role:</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={2} xs={6}>
                <Image src={this.state.profilePicture} alt={'Profile Picture'} style={{ height: '75px', width: '75px' }} />
              </Col>
              <Col md={3} xs={6}>
                <Form.Group controlId="pictureFormGroup">
                  <Button onClick={this.onButtonClicked} variant="light" className="ChooseFileButton_CA">
                    <Form.Control
                      name="profilePicture"
                      className="chooseFileButton_Login"
                      ref={this.hiddenFileInput}
                      id="file"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={this.changeProfilePicture}
                    />
                                Choose File
                            </Button>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row className="justify-content-md-center">
              <Col>
                <Button variant="light" className="CreateAccountButton_CA ladda-button" data-style="zoom-in" data-spinner-color="#000" id="createAccountButton" onClick={this.createAccount}>
                  <span className="ladda-label">Create Account</span>
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}
export default CreateAccount;
