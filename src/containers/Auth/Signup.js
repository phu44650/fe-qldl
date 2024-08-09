import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
// import * as actions from "../store/actions";
import * as actions from "../../store/actions";

import "./Signup.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";
// import { userLoginSuccess } from "../../store/actions";

import { createNewUserService } from "../../services/userService";
import validator from 'validator';
import { toast } from "react-toastify";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      isShowPassword: false,
      errMessage: "",
      isValidEmail: true,
      isValidPass: true,
      isValidFirstName: true,
      isValidLastName: true,
      isValidAddress: true,
    };
  }

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;



    //quy dinh dinh dang ma fname,lname co the ghi
    if (id === 'firstName') {
      const checkValidFirstName = /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/u.test(event.target.value);
      copyState.isValidFirstName = checkValidFirstName;
    }

    if (id === 'lastName') {
      const checkValidLastName = /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/u.test(event.target.value);
      copyState.isValidLastName = checkValidLastName;
    }


    if (id === 'address') {
      const checkValidAddress = /^[a-zA-Z0-9À-Ỹà-ỹ\s]+$/u.test(event.target.value);
      copyState.isValidAddress = checkValidAddress;
    }

    //gioi han so ky tu o cac o input
    // if (copyState[id].length > 20) {
    //   alert(`chi nhap khong qua 20 ki tu vao o ${id} `)
    //   return; // do not update state if input exceeds 20 characters
    // }


    this.setState({
      ...copyState,
    });
  };

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.handleAddNewUser();
    }
  };

  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);

      if (response && response.errCode === 1) {
        if (this.props.language == "en") {
          toast.error("This email already exists!");
        } else {
          toast.error("Email này đã tồn tại!");
        }
      }

      else {
        if (this.props.language == "en") {
          toast.success("User created successfully!");
        } else {
          toast.success("Tạo mới người dùng thành công!");
        }
        this.setState({
          password: "",
          email: "",
          firstName: "",
          lastName: "",
          address: "",
          isShowPassword: false,
        });
        this.props.history.push("/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["email", "password", "firstName", "lastName", "address"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        // alert("Missing parameter: " + arrInput[i]);
        if (this.props.language == "en") {
          toast.error("Missing parameter: " + arrInput[i]);
        } else {
          toast.error("Chưa nhập đủ thông tin: " + arrInput[i]);
        }
        break;
      }
    }
    return isValid;
  };

  handleAddNewUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      //call api create modal
      this.createNewUser(this.state); //can kiem tra lai cac input trong state cho fit
    }
  };
  handleOnChangEmail = (event) => {
    let email = event.target.value
    //quy dinh dinh dang gmail-bat buoc phai co duoi@.
    let checkValidEmail = validator.isEmail(email);
    console.log(checkValidEmail);
    //gioi han so ki tu
    // if (email.length > 25) {
    //   return; // do not update state if input exceeds 20 characters
    // }
    this.setState({
      email: email,
      isValidEmail: checkValidEmail,
    }, () => {
      console.log(this.state);
    });

  }

  render() {
    return (
      <div className="login-background">
        <div className="signup-container ">
          <div className="login-content row">
            <div className="col-12 text-login"><FormattedMessage id={"login.sign-up"} /></div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.Email"} /></label>
              <input
                type="text"
                className="form-control"
                placeholder={this.props.language === "en" ? "Enter your email" : "Nhập email của bạn"}
                value={this.state.email}
                onChange={(event) => this.handleOnChangEmail(event)}
              />
              {/* luc nay this.state.isValidEmail ===flase them dau ! thi ===true  thoe cau truc cau dk la neu dk === true thi cau lenh chay 
                    hoac don gian hon la this.state.isValidEmail === flase -> sua thanh the nay cung dc  */}
              {!this.state.isValidEmail && (
                <span style={{ color: 'red' }}><FormattedMessage id={"login.title1"} /></span>
              )}
            </div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.password"} />:</label>
              <div className="custom-input-password">
                <input
                  className="form-control"
                  type={this.state.isShowPassword ? "text" : "password"}
                  placeholder={this.props.language === "en" ? "Enter your password" : "Nhập mật khẩu của bạn"}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "password")
                  }
                  onKeyDown={(event) => this.handleKeyDown(event)}
                />

                <span
                  onClick={() => {
                    this.handleShowHidePassword();
                  }}
                >
                  <i
                    className={
                      this.state.isShowPassword
                        ? "far fa-eye"
                        : "fas fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.firstname"} /></label>
              <input
                type="text"
                className="form-control"
                placeholder={this.props.language === "en" ? "Enter your firstname" : "Nhập tên của bạn"}
                value={this.state.firstName}
                onChange={(event) =>
                  this.handleOnChangeInput(event, "firstName")
                }
              />
              {!this.state.isValidFirstName && (
                <span style={{ color: 'red' }}><FormattedMessage id={"login.title2"} /></span>
              )}
            </div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.lastname"} />:</label>
              <input
                type="text"
                className="form-control"
                placeholder={this.props.language === "en" ? "Enter your lastname" : "Nhập họ của bạn"}
                value={this.state.lastName}
                onChange={(event) =>
                  this.handleOnChangeInput(event, "lastName")
                }
              />
              {!this.state.isValidLastName && (
                <span style={{ color: 'red' }}><FormattedMessage id={"login.title3"} /></span>
              )}
            </div>
            <div className="col-12 form-group login-input">
              <label><FormattedMessage id={"login.address"} />:</label>
              <input
                type="text"
                className="form-control"
                placeholder={this.props.language === "en" ? "Enter your address" : "Nhập địa chỉ của bạn"}
                value={this.state.address}
                onChange={(event) => this.handleOnChangeInput(event, "address")}
              />
              {!this.state.isValidAddress && (
                <span style={{ color: 'red', font: '5px' }}><FormattedMessage id={"login.title4"} /></span>
              )}
            </div>
            {/* <div className="col-12" style={{ color: "red" }}>
              {this.state.errMessage}
            </div> */}
            <div className="col-12">
              <button
                className="btn-login"
                onClick={() => {
                  this.handleAddNewUser();
                }}
              >
                <FormattedMessage id={"login.sign-up"} />
              </button>
            </div>
            {/* <div className="col-12 section-forgot-signup">
              <span className="forgot-password">Forgot your password</span>
              <span className="sign-up">Sign up</span>
            </div> */}
            {/* <div className="col-12 text-center mt-3">
              <span className="text-other-login">Or Signup with:</span>
            </div>
            <div className="col-12 social-login">
              <i className="fab fa-google-plus-g google"></i>
              <i className="fab fa-facebook-square facebook"></i>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    userLoginSuccess: (userInfor) =>
      dispatch(actions.userLoginSuccess(userInfor)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
