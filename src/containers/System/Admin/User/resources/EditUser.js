import { useRef, useState, useEffect } from "react";

import { FormattedMessage } from "react-intl";

import { useParams, useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../../utils";
import * as actions from "../../../../../store/actions";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

import {
  getAllUsers
} from "../../../../../services/userService";


export default function EditUser() {

  const [genderArr, setGenderArr] = useState([]);
  const [positionArr, setPositionArr] = useState([]);
  const [roleArr, setRoleArr] = useState([]);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState(0);
  const [action, setAction] = useState("");
  const [userEditId, setUserEditId] = useState("");
  const [isValidFirstName, setIsValidFirstName] = useState(true);
  const [isValidLastName, setIsValidLastName] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [isValidAddress, setIsValidAddress] = useState(true);
  let { userId } = useParams();
  console.log("userId", userId)

  const { isLoggedIn, userInfo, language, genderRedux, roleRedux, positionRedux, isLoadingGender, listUsers } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
    genderRedux: state.admin.genders,
    roleRedux: state.admin.roles,
    positionRedux: state.admin.positions,
    isLoadingGender: state.admin.isLoadingGender,
    listUsers: state.admin.users,
  }));

  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(async () => {
    dispatch(actions.fetchGenderStart())
    dispatch(actions.fetchPositionStart())
    dispatch(actions.fetchRoleStart())

    await getUserInfo()
  }, []);

  useEffect(() => {
    let arrGenders = genderRedux;
    setGenderArr(arrGenders)

    let arrPositions = positionRedux;
    setPositionArr(arrPositions)

    let arrRoles = roleRedux;
    setRoleArr(arrRoles)
  }, [genderRedux, positionRedux, roleRedux]);

  const getUserInfo = async () => {
    let res = await getAllUsers(userId)
    console.log(res);
    if (res && res.errCode == 0 && res.users) {
      console.log("res", res)
      setEmail(res.users.email)
      setFirstName(res.users.firstName)
      setLastName(res.users.lastName)
      setAddress(res.users.address)
      setPhoneNumber(res.users.phonenumber)
      setGender(res.users.gender)
      setRole(res.users.roleId)
      setPosition(res.users.positionId)
      setAvatar(res.users.image)
      setStatus(res.users.status)
      let imageBase64;
      if (res.users.image) {
        imageBase64 = new Buffer(res.users.image, "base64").toString("binary");
        setPreviewImgURL(imageBase64)

      }
    }
  }

  const onChangeInput = (event, id) => {

    switch (id) {
      case "email":
        setEmail(event.target.value)
        break;
      case "firstName":
        const checkValidFirstName = /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/u.test(event.target.value);
        setIsValidFirstName(checkValidFirstName);
        setFirstName(event.target.value);
        break;
      case "lastName":
        const checkValidLastName = /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/u.test(event.target.value);
        setIsValidLastName(checkValidLastName);
        setLastName(event.target.value)
        break;
      case "phoneNumber":
        const checkValidPhoneNumber = /^\d{11}$/.test(event.target.value);

        setIsValidPhoneNumber(checkValidPhoneNumber);
        setPhoneNumber(event.target.value)
        break;
      case "address":
        const checkValidAddress = /^[a-zA-Z0-9À-Ỹà-ỹ\s]+$/u.test(event.target.value)
        setIsValidAddress(checkValidAddress);
        setAddress(event.target.value)
        break;
      case "gender":
        setGender(event.target.value)
        break;
      case "role":
        setRole(event.target.value)
        break;
      case "position":
        setPosition(event.target.value)
        break;
      case "status":
        setStatus(event.target.value)
        break;
      default:
        break;
    }
  };

  const handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (data) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      setPreviewImgURL(objectUrl)
      setAvatar(base64)
      console.log(base64);
      //   this.setState({
      //     setPreviewImgURL: objectUrl,//link/previewImgURL
      //     avatar: base64//text báe64
      // })
    }
  };

  const openPreviewImage = () => {
    if (!previewImgURL) return;
    setIsOpen(true)
  };

  const checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      role,
      avatar
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!arrCheck[i]) {
        isValid = false;
        if (language == "vi") {
          toast.warn("Bạn chưa nhập đủ thông tin");
        } else {
          toast.warn("Missing input");
        }
        break;
      }
    }
    return isValid;
  };


  const handleSaveUser = () => {
    //neu sai dinh dang thi return
    if (!isValidAddress || !isValidPhoneNumber || !isValidFirstName || !isValidLastName) return
    let isValid = checkValidateInput();

    if (isValid === false) return;

    dispatch(actions.editAUser({
      id: userId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      address: address,
      phonenumber: phoneNumber,
      gender: gender,
      roleId: role,
      positionId: position,
      avatar: avatar,
      status: status
    }))

    setTimeout(function () { window.location.href = '/admin-dashboard/user'; }, 1000);
  };

  return (
    <div>
      <div className="title mb-60">
        <FormattedMessage id="manage-user.title-edit-user" />
      </div>
      <div className="row">
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.email" />
          </label>
          <input
            readOnly
            className="form-control"
            type="email"
            value={email}
          // onChange={(event) => {
          //   onChangeInput(event, "email");
          // }}
          />
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.first-name" />
          </label>
          <input
            className="form-control"
            type="text"
            value={firstName}
            onChange={(event) => {
              onChangeInput(event, "firstName");
            }}
          />
          {!isValidFirstName && (
            <span style={{ color: 'red' }}>
              <FormattedMessage id="login.title2" />
            </span>
          )}
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.last-name" />
          </label>
          <input
            className="form-control"
            type="text"
            value={lastName}
            onChange={(event) => {
              onChangeInput(event, "lastName");
            }}
          />
          {!isValidLastName && (
            <span style={{ color: 'red' }}>
              <FormattedMessage id="login.title3" />
            </span>
          )}
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.phone-number" />
          </label>
          <input
            maxlength="11"
            className="form-control"
            type="text"
            value={phoneNumber}
            onChange={(event) => {
              onChangeInput(event, "phoneNumber");
            }}
          />
          {!isValidPhoneNumber && (
            <span style={{ color: 'red' }}>
              <FormattedMessage id="login.title5" />
            </span>
          )}
        </div>
        <div className="col-9">
          <label>
            <FormattedMessage id="manage-user.address" />
          </label>
          <input
            className="form-control"
            type="text"
            value={address}
            onChange={(event) => {
              onChangeInput(event, "address");
            }}
          />
          {!isValidAddress && (
            <span style={{ color: 'red' }}>
              <FormattedMessage id="login.title4" />
            </span>
          )}
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.gender" />
          </label>
          <select
            className="form-control"
            onChange={(event) => {
              onChangeInput(event, "gender");
            }}
            value={gender}
          >
            <option value="">
              {language === LANGUAGES.VI
                ? "Chọn giới tính"
                : "Choose gender"}
            </option>
            {genderArr &&
              genderArr.length > 0 &&
              genderArr.map((item, index) => {
                return (
                  <option key={index} value={item.keyMap}>
                    {language === LANGUAGES.VI
                      ? item.valueVi
                      : item.valueEn}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.role" />
          </label>
          <select
            className="form-control"
            onChange={(event) => {
              onChangeInput(event, "role");
            }}
            value={role}
          >
            <option value="">
              {language === LANGUAGES.VI
                ? "Chọn vai trò"
                : "Choose role"}
            </option>
            {roleArr &&
              roleArr.length > 0 &&
              roleArr.map((item, index) => {
                return (
                  <option key={index} value={item.keyMap}>
                    {language === LANGUAGES.VI
                      ? item.valueVi
                      : item.valueEn}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.position" />
          </label>
          <select
            className="form-control"
            onChange={(event) => {
              onChangeInput(event, "position");
            }}
            value={position}
          >
            <option value="">
              {language === LANGUAGES.VI
                ? "Chọn chức danh"
                : "Choose positon"}
            </option>
            {positionArr &&
              positionArr.length > 0 &&
              positionArr.map((item, index) => {
                return (
                  <option key={index} value={item.keyMap}>
                    {language === LANGUAGES.VI
                      ? item.valueVi
                      : item.valueEn}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.status" />
          </label>
          <select
            className="form-control"
            onChange={(event) => {
              onChangeInput(event, "status");
            }}
            value={status}
          >
            {/* <option value="">
                          {language === LANGUAGES.VI
                            ? "Chọn trạng thái"
                            : "Choose status"}
                        </option> */}
            <option value="0">
              {language === LANGUAGES.VI
                ? "Hoạt động"
                : "Active"}
            </option>
            <option value="1">
              {language === LANGUAGES.VI
                ? "Cấm"
                : "Banned"}
            </option>
          </select>
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.image" />
          </label>
          <div className="preview-img-container">
            <input
              id="previewImg"
              type="file"
              hidden
              onChange={(event) => handleOnChangeImage(event)}
            />
            <label className="label-upload" htmlFor="previewImg">
              Tải ảnh <i className="fas fa-upload"></i>
            </label>
            <div
              className="preview-image"
              style={{
                backgroundImage: `url(${previewImgURL})`,
              }}
              onClick={() => openPreviewImage()}
            ></div>
          </div>
        </div>
        <div className="col-12 mt-3">
          <button
            className="btn btn-primary"
            onClick={() => handleSaveUser()}
          >
            <FormattedMessage id="manage-user.btn-update" />
          </button>
        </div>
      </div>

      {isOpen === true && (
        <Lightbox
          mainSrc={previewImgURL}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}

    </div>
  );
}

