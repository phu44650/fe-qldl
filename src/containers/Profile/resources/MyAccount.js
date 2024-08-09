import { useRef, useState, useEffect } from "react";

import "../scss/MyAccount.scss";
import { FormattedMessage } from "react-intl";

import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import EditProfileModal from "./EditProfileModal"
import EditPasswordModal from "./EditPasswordModal"
import * as actions from "../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";

import { Modal } from "reactstrap";

// import {
//   getHandleLoginGoogle
// } from "../../services/userService";

export default function MyAccount() {
    const [isOpenModalBooking, setIsOpenModalBooking] = useState(false);
    const [isOpenModalEditPassword, setIsOpenModalEditPassword] = useState(false);

    const [previewImgURL, setPreviewImgURL] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [avatar, setAvatar] = useState("");

    const dispatch = useDispatch();
    let history = useHistory();

    const { isLoggedIn, userInfo, language } = useSelector((state) => ({
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
        genderRedux: state.admin.genders,
    }));

    useEffect(() => {
        dispatch(actions.fetchGenderStart());
        getUserInfor();
    }, []);

    useEffect(() => {
        getUserInfor();
    }, [userInfo]);


    const closeBookingClose = () => {
        setIsOpenModalBooking(false)
    };

    const closeEditPasswordClose = () => {
        setIsOpenModalEditPassword(false)
    };

    const getUserInfor = () => {
        if (!userInfo) return;

        let imageBase64 = "";
        if (userInfo.image) {
            imageBase64 = new Buffer(userInfo.image, "base64").toString("binary");
        }

        if (userInfo) {
            setEmail(userInfo.email);
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setPhonenumber(userInfo.phonenumber)
            setAddress(userInfo.address);
            setGender(userInfo.gender);
            setPreviewImgURL(imageBase64 ? imageBase64 : null)
        }
    }

    const showGender = () => {
        if (gender && language === LANGUAGES.VI && gender == "M") return "Nam"
        if (gender && language === LANGUAGES.VI && gender == "F") return "Nữ"
        if (gender && language === LANGUAGES.EN && gender == "M") return "Male"
        if (gender && language === LANGUAGES.EN && gender == "F") return "Female"
        return ""
    };

    return (
        <div>
            <h2 className="font-weight-bold fs-24">
                <FormattedMessage id="profile-setting.my-account" />
            </h2>
            <div className="rsolution-card-shadow" style={{ width: "650px" }}>
                <div className="rsolution-card-body">
                    <div className="row">
                        <div className="col-auto pt-20">
                            <div className="avatar-box" style={{ width: "185px", height: "185px", backgroundImage: `url(${previewImgURL})` }}
                            ></div>
                            {language === LANGUAGES.VI
                                ?
                                <div className="text-center fs-25 font-weight-bold text-secondary text-truncate mt-10">{firstName} {lastName}</div>
                                :
                                <div className="text-center fs-25 font-weight-bold text-secondary text-truncate mt-10"> {lastName} {firstName}</div>
                            }

                        </div>
                        <div className="col">
                            <div className="row my-20">
                                <div className="col-auto" style={{ width: "130px" }}>
                                    <h6 className="font-weight-bold mb-0"><FormattedMessage id="profile-setting.name" />:</h6>
                                </div>
                                <div className="col">


                                    {language === LANGUAGES.VI
                                        ?
                                        <h6 className="mb-0 truncate"> {lastName} {firstName}</h6>
                                        :
                                        <h6 className="mb-0 truncate">  {firstName} {lastName}</h6>
                                    }
                                </div>
                            </div>

                            <div className="row my-20">
                                <div className="col-auto" style={{ width: "130px" }}>
                                    <h6 className="font-weight-bold mb-0"><FormattedMessage id="profile-setting.gender" />:</h6>
                                </div>
                                <div className="col">
                                    <h6 className="mb-0 truncate">
                                        {
                                            showGender()
                                        }
                                    </h6>
                                </div>
                            </div>

                            <div className="row my-20">
                                <div className="col-auto" style={{ width: "130px" }}>
                                    <h6 className="font-weight-bold mb-0"><FormattedMessage id="profile-setting.phone" />:</h6>
                                </div>
                                <div className="col">
                                    <h6 className="mb-0 truncate">{phonenumber}</h6>
                                </div>
                            </div>

                            <div className="row my-20">
                                <div className="col-auto" style={{ width: "130px" }}>
                                    <h6 className="font-weight-bold mb-0"><FormattedMessage id="profile-setting.address" />:</h6>
                                </div>
                                <div className="col">
                                    <h6 className="mb-0 truncate">{address}</h6>
                                </div>
                            </div>

                            <div className="row my-20">
                                <div className="col-auto" style={{ width: "130px" }}>
                                    <h6 className="font-weight-bold mb-0">Email:</h6>
                                </div>
                                <div className="col">
                                    <h6 className="mb-0 truncate">{email}</h6>
                                </div>
                            </div>

                            <div className="row my-20">
                                <div className="col-auto" style={{ width: "130px" }}>
                                    <h6 className="font-weight-bold mb-0"><FormattedMessage id="profile-setting.password" />:</h6>
                                </div>
                                <div className="col">
                                    <h6 className="mb-0 truncate">*********</h6>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-pencil-alt pointer" onClick={() => setIsOpenModalEditPassword(true)}></i>
                                </div>
                            </div>

                            <button className="btn btn-outline-primary btn-block" onClick={() => setIsOpenModalBooking(true)}><i className="fas fa-edit mr-8"></i><FormattedMessage id="profile-setting.btn-edit-profile" /></button>
                        </div>
                    </div>
                </div>
            </div>
            <EditPasswordModal
                isOpenModal={isOpenModalEditPassword}
                closeEditPasswordClose={closeEditPasswordClose}
            />
            <EditProfileModal
                isOpenModal={isOpenModalBooking}
                closeBookingClose={closeBookingClose}
            />
        </div>
    );
}
