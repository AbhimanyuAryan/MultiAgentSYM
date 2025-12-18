/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { userLogin } from "../../redux/actions/LoginAction";
import jumpTo from "../../modules/Navigation";
import Validator from "../../utils/Validator";
import { DEFAULT_RULE, EMAIL_RULE } from "../../utils/Validator/rule";
import PropTypes from "prop-types";
import LoadingButton from "../LoadingButton";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      error: null
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { email, password } = this.state;

    // Clear previous error
    this.setState({ error: null });

    if (!Validator(email, EMAIL_RULE)) {
      this.setState({ error: "Please enter a valid email" });
      return;
    }
    if (!Validator(password, DEFAULT_RULE)) {
      this.setState({ error: "Please enter a password" });
      return;
    }

    this.setState({ loading: true });
    this.props
      .userLogin(email, password)
      .then(res => {
        console.log('Login successful:', res);
        this.setState({ loading: false, error: null });
        window.location.reload();
      })
      .catch(error => {
        console.log('Login error:', error);
        const errorMessage = error.message || error.response?.data?.message || 'Login failed. Please check your credentials.';
        this.setState({
          loading: false,
          error: errorMessage
        });
      });
  };

  render() {
    return (
      <div>
        <div className="login-form">
          <h2>Login</h2>
          <div className="form-group ">
            <input
              type="text"
              className="form-control"
              placeholder="Email "
              id="UserName"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              autoComplete="false"
            />
            <i className="fa fa-user"></i>
          </div>
          <div className="form-group log-status">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="Passwod"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              autoComplete="false"
            />
            <i className="fa fa-lock"></i>
          </div>
          {this.state.error && (
            <div style={{
              color: '#ff4757',
              fontSize: '14px',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#ffe5e5',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              {this.state.error}
            </div>
          )}
          <a
            className="link"
            href="#"
            onClick={this.props.forgotPasswordClicked}
            style={{ display: 'none' }}
          >
            Lost your password?
          </a>
          <LoadingButton
            type="button"
            className="log-btn"
            loading={this.state.loading}
            onClick={() => this.handleSubmit()}
          >
            Log in
          </LoadingButton>
          <div
            onClick={this.props.registerClicked}
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#c4c4c4",
              cursor: "pointer"
            }}
          >
            New user ? Please Register
          </div>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  forgotPasswordClicked: PropTypes.func,
  registerClicked: PropTypes.func
};

const mapDispatchToProps = {
  userLogin
};
const mapStoreToProps = state => ({
  login_loading: state.login.login_loading,
  login_error: state.login.error
});

export default connect(mapStoreToProps, mapDispatchToProps)(LoginForm);
