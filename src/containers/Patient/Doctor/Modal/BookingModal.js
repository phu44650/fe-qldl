import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import LoadingOverlay from "react-loading-overlay";
import { css } from "@emotion/react";
import BounceLoader from "react-spinners/BounceLoader";
import { withRouter } from "react-router";
import validator from 'validator';
import Vietnamese from './vn'
class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: "",
      timeType: "",
      isShowLoading: false,
      isValidPatientName: true,
      isValidPhoneNumber: true,
      isValidAddress: true,
      isValidreason: true,
    };
  }

  async componentDidMount() {

    if (this.props.userInfo && this.props.userInfo.email) {
      this.setState({
        email: this.props.userInfo.email
      })
    }

    this.props.getGenders();
  }

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;

    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }

    if (this.props.userInfo !== prevProps.userInfo) {
      if (this.props.userInfo && this.props.userInfo.email) {
        this.setState({
          email: this.props.userInfo.email
        })
      }
    }

    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }

    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }

  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let copyState = { ...this.state };
    copyState[id] = valueInput;
    if (id === 'patientName') {
      const checkValidFirstName = /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/u.test(event.target.value);
      copyState.isValidPatientName = checkValidFirstName;
    }

    if (id === 'phoneNumber') {
      // Kiểm tra xem giá trị có chính xác 10 chữ số không
      const checkValidPhoneNumber = /^\d{11}$/.test(event.target.value);
      copyState.isValidPhoneNumber = checkValidPhoneNumber;
    }


    if (id === 'address') {
      const checkValidAddress = /^[a-zA-Z0-9À-Ỹà-ỹ\s]+$/u.test(event.target.value);
      copyState.isValidAddress = checkValidAddress;
    }
    if (id === 'reason') {
      const checkValidAddress = /^[a-zA-Z0-9À-Ỹà-ỹ\s]+$/u.test(event.target.value);
      copyState.isValidreason = checkValidAddress;
    }
    this.setState({
      ...copyState,
    });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedGender: selectedOption });
  };

  buildTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;

      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
            .unix(+dataTime.date / 1000)
            .locale("en")
            .format("ddd - MM/DD/YYYY");
      return `${time} - ${date}`;
    }
    return "";
  };

  handleDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;

      return name;
    }
    return "";
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["patientName", "phoneNumber", "email", "address", "reason", "birthday", "selectedGender"];
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

  handleConfirmBooking = async () => {
    let isValid = this.checkValidateInput();
    if (!this.state.isValidAddress || !this.state.isValidPhoneNumber || !this.state.isValidPatientName || !this.state.isValidreason) return
    if (isValid === true) {
      //call api create modal
      this.setState({ isShowLoading: true });
      let { language } = this.props;

      //validate input
      // !data.email || !data.doctorId || !data.timeType || !data.date
      let date = new Date(this.state.birthday).getTime();
      let timeString = this.buildTimeBooking(this.props.dataTime);
      let doctorName = this.handleDoctorName(this.props.dataTime);
      let res = await postPatientBookAppointment({
        patientName: this.state.patientName,
        phoneNumber: this.state.phoneNumber,
        email: this.state.email,
        address: this.state.address,
        reason: this.state.reason,
        date: this.props.dataTime.date,
        birthday: date,
        selectedGender: this.state.selectedGender.value,
        doctorId: this.props.match.params.id,
        timeType: this.state.timeType,
        language: this.props.language,
        timeString: timeString,
        doctorName: doctorName,
      });

      if (res && res.errCode === 0) {
        this.setState({ isShowLoading: false });
        if (language === "en") {
          toast.success("Book a new appointment successfully, please check your email for confirmation!");
        } else {
          toast.success("Đặt lịch khám thành công, hãy kiểm tra email của bạn để xác nhận!");
        }

        this.props.closeBookingClose();
      }
      else if (res && res.errCode === 3) {
        this.setState({ isShowLoading: false });
        if (language === "en") {
          toast.warn("The number of bookings has been exceeded at this time, please choose another time!");
        } else {
          toast.warn("Đã quá số lượng giới hạn đặt lịch vào thời gian này bạn vui lòng chọn khung thời gian khác!");
        }
      }
      else {
        this.setState({ isShowLoading: false });
        if (language === "en") {
          toast.error("Book a new appointment error!");
        } else {
          toast.error("Đặt lịch không thành công!");
        }
      }
    };
  }


  render() {
    let { isOpenModal, closeBookingClose, dataTime, language } = this.props;

    let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";

    return (
      <LoadingOverlay
        active={this.state.isShowLoading}
        spinner={<BounceLoader color={"#86e7d4"} size={60} />}
      >
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="lg"
          centered
        >
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="left">
                <FormattedMessage id="patient.booking-modal.title" />
              </span>
              <span className="right" onClick={closeBookingClose}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="booking-modal-body">
              {/* {JSON.stringify(dataTime)} */}
              <div className="doctor-infor">
                <ProfileDoctor
                  doctorId={doctorId}
                  isShowDescriptionDoctor={false}
                  dataTime={dataTime}
                  isShowLinkDetail={false}
                  isShowPrice={true}
                />
              </div>

              <div className="row">
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.patientName" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.patientName}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "patientName")
                    }

                  />
                  {!this.state.isValidPatientName && (
                    <span style={{ color: 'red' }}><FormattedMessage id={"login.title2"} /></span>
                  )}
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.phoneNumber" />
                  </label>
                  <input
                    maxlength="11"
                    className="form-control"
                    value={this.state.phoneNumber}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "phoneNumber")
                    }
                  />
                  {!this.state.isValidPhoneNumber && (
                    <span style={{ color: 'red' }}><FormattedMessage id={"login.title5"} /></span>
                  )}
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.email" />
                  </label>
                  <input
                    readOnly
                    className="form-control"
                    value={this.state.email}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "email")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.address" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.address}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "address")
                    }
                  />
                  {!this.state.isValidAddress && (
                    // <span style={{ color: 'red' }}><FormattedMessage id={"login.title2"} /></span>
                    < span style={{ color: 'red' }}><FormattedMessage id={"login.title6"} /></span>
                  )}
                </div>
                <div className="col-12 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.reason" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.reason}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "reason")
                    }
                  />
                  {!this.state.isValidreason && (
                    // <span style={{ color: 'red' }}><FormattedMessage id={"login.title2"} /></span>
                    < span style={{ color: 'red' }}><FormattedMessage id={"login.title7"} /></span>
                  )}
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.birthday" />
                  </label>
                  <DatePicker
                    onChange={this.handleOnChangeDatePicker}
                    className="form-control"
                    //  value={this.state.birthday}

                    selected={this.state.birthday}
                    options={{



                      maxDate: new Date(),

                      locale: language === LANGUAGES.VI ? Vietnamese : '',



                    }}
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.gender" />
                  </label>
                  <Select
                    value={this.state.selectedGender}
                    onChange={this.handleChangeSelect}
                    options={this.state.genders}
                  />
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <button
                className="btn-booking-confirm"
                onClick={() => this.handleConfirmBooking()}
              >
                <FormattedMessage id="patient.booking-modal.btnConfirm" />
              </button>
              <button
                className="btn-booking-cancel"
                onClick={closeBookingClose}
              >
                <FormattedMessage id="patient.booking-modal.btnCancel" />
              </button>
            </div>
          </div>
        </Modal>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language, genders: state.admin.genders, isLoggedIn: state.user.isLoggedIn, userInfo: state.user.userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));
