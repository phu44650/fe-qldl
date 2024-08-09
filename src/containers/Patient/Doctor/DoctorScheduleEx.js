import React, { Component } from "react";
import { connect } from "react-redux";

import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import { toast } from "react-toastify";
import "./DoctorScheduleEx.scss"
import Select from "react-select";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate, deleteSchedule } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";
import { withRouter } from "react-router";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { injectIntl } from 'react-intl';
class DoctorScheduleEx extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
            today: "", date1: {}
        };
    }

    async componentDidMount() {
        let { language } = this.props;

        let allDays = this.getArrDays(language);
        console.log("allDays", allDays)
        if (this.props.doctorIdFromParent) {


            let res = await getScheduleDoctorByDate(
                this.props.doctorIdFromParent,
                allDays[0].value
            );

            let copy_allAvailableTime = []
            let currentHour = moment().format("HH");

            if (res && res.data) {
                console.log("res.data", res.data)
                let copyRes = [...res.data];
                copy_allAvailableTime = copyRes.filter((element) => element.timeTypeData.value > currentHour)
                console.log("copy_allAvailableTime", copy_allAvailableTime)
                this.setState({
                    allAvailableTime: copy_allAvailableTime ? copy_allAvailableTime : [],
                });
            }

            this.setState({
                today: allDays[0].value,
            });

        }

        if (allDays && allDays.length > 0) {
            this.setState({
                allDays: allDays,
            });
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getArrDays = (language) => {
        // console.log("moment vi", moment(new Date()).format("dddd - DD/MM"));
        // console.log(
        //   "moment en",
        //   moment(new Date()).locale("en").format("ddd - DD/MM")
        // );

        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format("DD/MM");
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date())
                        .add(i, "days")
                        .format("dddd - DD/MM");
                    object.label = this.capitalizeFirstLetter(labelVi);
                }
            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format("DD/MM");
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date())
                        .add(i, "days")
                        .locale("en")
                        .format("ddd - DD/MM");
                }
            }

            object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();

            allDays.push(object);
        }
        return allDays;
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);

            this.setState({
                allDays: allDays,
            });
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            let res = await getScheduleDoctorByDate(
                this.props.doctorIdFromParent,
                allDays[0].value
            );

            let copy_allAvailableTime = []
            let currentHour = moment().format("HH");

            if (res && res.data) {
                let copyRes = [...res.data];
                copy_allAvailableTime = copyRes.filter((element) => element.timeTypeData.value > currentHour)
                this.setState({
                    allAvailableTime: copy_allAvailableTime ? copy_allAvailableTime : [],
                });
            }
        }
    }
    handleDeleteScheduleTime = async (data) => {
        const { intl } = this.props;
        try {
            const result = await Swal.fire({
                title: intl.formatMessage({ id: 'patient.detail-doctor.title' }),
                text: intl.formatMessage({ id: 'patient.detail-doctor.text' }),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: intl.formatMessage({ id: 'patient.detail-doctor.yes' }),
                cancelButtonText: intl.formatMessage({ id: 'patient.detail-doctor.no' }),
                allowOutsideClick: false,
            });

            if (result.isConfirmed) {
                // Nếu người dùng xác nhận xóa, thực hiện hành động xóa ở đây
                const res1 = await deleteSchedule(data);

                if (res1 && res1.errCode === 0) {
                    const successMessage = this.props.language === "en"
                        ? "Delete Schedule succeed!"
                        : "Xóa lịch hẹn khám thành công";
                    toast.success(successMessage);
                } else {
                    const errorMessage = this.props.language === "en"
                        ? "Error!"
                        : "Lỗi!";
                    toast.error(errorMessage);
                }

                const date = this.state.date1;
                const res = await getScheduleDoctorByDate(
                    this.props.doctorIdFromParent,
                    date
                );

                if (res && res.data) {
                    console.log("res.data", res.data, date);
                }

                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                });
            }
        } catch (error) {
            console.error('Error while handling delete schedule:', error);
        }
    };


    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let date1 = date
            let res = await getScheduleDoctorByDate(doctorId, date);

            if (res && res.errCode === 0) {
                let copy_allAvailableTime = []
                let currentHour = moment().format("HH");

                if (res && res.data && date && currentHour) {
                    if (date == this.state.today) {
                        copy_allAvailableTime = [...res.data].filter((element) =>
                            element.timeTypeData.value > currentHour
                        )
                        if (copy_allAvailableTime) this.setState({
                            allAvailableTime: copy_allAvailableTime ? copy_allAvailableTime : [],
                        });
                    } else {
                        this.setState({
                            allAvailableTime: res.data ? res.data : [],
                            date1: date1
                        });
                    }
                }

                // this.setState({
                //   allAvailableTime: res.data ? res.data : [],
                // });
            }
        }
    };

    handleClickScheduleTime = (time) => {
        if (!this.props.isLoggedIn) this.props.history.push("/login");
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time,
        });
    };

    closeBookingClose = () => {
        this.setState({
            isOpenModalBooking: false,
        });
    };
    render() {
        let {
            allDays,
            allAvailableTime,
            isOpenModalBooking,
            dataScheduleTimeModal,
        } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {allDays &&
                                allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option value={item.value} key={index}>
                                            {item.label}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="all-availabel-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt">
                                <span>
                                    &nbsp;
                                    <FormattedMessage id="patient.detail-doctor.scheduleByDoctor" />
                                </span>
                            </i>
                        </div>
                        <div className="time-content">
                            {allAvailableTime && allAvailableTime.length > 0 ? (
                                <>
                                    <div className="time-content-btns">
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay =
                                                language === LANGUAGES.VI
                                                    ? item.timeTypeData.valueVi
                                                    : item.timeTypeData.valueEn;

                                            return (
                                                // <button

                                                //     key={index}
                                                //     className={
                                                //         language === LANGUAGES.VI ? "btn-vi" : "btn-en"
                                                //     }
                                                // // onClick={() => this.handleClickScheduleTime(item)}

                                                // >
                                                //     <span className="close-icon">&#10006;</span>
                                                //     {timeDisplay}
                                                // </button>
                                                <div className="button-container">
                                                    <button
                                                        key={index}
                                                        className={language === LANGUAGES.VI ? "btn-vi custom-button" : "btn-en custom-button"}
                                                        onClick={() => this.handleDeleteScheduleTime(item)}

                                                    >
                                                        {timeDisplay}
                                                    </button>
                                                </div>

                                            );
                                        })}
                                    </div>


                                </>
                            ) : (
                                <div className="no-schedule">
                                    <FormattedMessage id="patient.detail-doctor.no-schedule1" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingClose={this.closeBookingClose}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return { language: state.app.language, isLoggedIn: state.user.isLoggedIn };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(DoctorScheduleEx)));
