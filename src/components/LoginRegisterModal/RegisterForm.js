/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

import React, { Component } from "react";
import jumpTo from "../../modules/Navigation";
import Validator from "../../utils/Validator";
import { DEFAULT_RULE, EMAIL_RULE } from "../../utils/Validator/rule";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userRegister } from "../../redux/actions/RegisterAction";
import LoadingButton from "../LoadingButton";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      error: null,
      success: null
    };
  }
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { name, email, password } = this.state;

    // Clear previous messages
    this.setState({ error: null, success: null });

    if (!Validator(name, DEFAULT_RULE)) {
      this.setState({ error: "Please enter your name" });
      return;
    }
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
      .userRegister(name, email, password, password)
      .then(res => {
        console.log('Registration successful:', res);
        this.setState({
          loading: false,
          success: "Registration successful! You can now login.",
          error: null
        });
        // Switch to login form after 2 seconds
        setTimeout(() => {
          this.props.loginClicked();
        }, 2000);
      })
      .catch(error => {
        console.log('Registration error:', error);
        const errorMessage = error.message || error.response?.data?.message || 'Registration failed. Please try again.';
        this.setState({
          loading: false,
          error: errorMessage,
          success: null
        });
      });
  };

  render() {
    return (
      <div>
        <div className="login-form">
          <h2>Register</h2>
          <div className="form-group ">
            <input
              type="text"
              className="form-control"
              placeholder="Name "
              id="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              autoComplete="false"
            />
            <i className="fa fa-user"></i>
          </div>

          <div className="form-group ">
            <input
              type="text"
              className="form-control"
              placeholder="Email "
              id="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              autoComplete="false"
            />
            <i className="fa fa-envelope"></i>
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
          {this.state.success && (
            <div style={{
              color: '#2ecc71',
              fontSize: '14px',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#e8f8f5',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              {this.state.success}
            </div>
          )}
          <LoadingButton
            type="button"
            className="log-btn"
            loading={this.state.loading}
            onClick={() => this.handleSubmit()}
          >
            Register
          </LoadingButton>
          <div
            onClick={this.props.loginClicked}
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#c4c4c4",
              cursor: "pointer"
            }}
          >
            Already have an account ? Please login.
          </div>
        </div>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  loginClicked: PropTypes.func
};

const mapDispatchToProps = {
  userRegister
};
const mapStoreToProps = state => ({
  register_loading: state.register.register_loading,
  register_error: state.register.error
});

export default connect(mapStoreToProps, mapDispatchToProps)(RegisterForm);
