import { useRef, useState, useEffect } from "react";

// import * as actions from "../../store/actions";

import { FormattedMessage } from "react-intl";

import { useParams, useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../../utils";
import * as actions from "../../../../../store/actions";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import validator from 'validator';



export default function CreateUser() {

  const [genderArr, setGenderArr] = useState([]);
  const [positionArr, setPositionArr] = useState([]);
  const [roleArr, setRoleArr] = useState([]);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  useEffect(() => {
    dispatch(actions.fetchGenderStart())
    dispatch(actions.fetchPositionStart())
    dispatch(actions.fetchRoleStart())
  }, []);

  useEffect(() => {
    let arrGenders = genderRedux;
    setGenderArr(arrGenders)

    let arrPositions = positionRedux;
    setPositionArr(arrPositions)

    let arrRoles = roleRedux;
    setRoleArr(arrRoles)
  }, [genderRedux, positionRedux, roleRedux]);


  const onChangeInput = (event, id) => {
    switch (id) {
      case "email":
        const checkValidEmail = validator.isEmail(event.target.value);
        setIsValidEmail(checkValidEmail);
        setEmail(event.target.value)

        break;
      case "password":
        setPassword(event.target.value)
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
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      setPreviewImgURL(objectUrl)
      setAvatar(base64)
    }
  };

  const openPreviewImage = () => {
    if (!previewImgURL) return;
    setIsOpen(true)
  };

  // const checkValidateInput = () => {
  //   let isValid = true;
  //   let arrCheck = [
  //     email,
  //     password,
  //     firstName,
  //     lastName,
  //     phoneNumber,
  //     address,

  //   ];
  //   for (let i = 0; i < arrCheck.length; i++) {
  //     if (!arrCheck[i]) {
  //       isValid = false;
  //       if (language == "vi") {
  //         toast.warn("Bạn chưa nhập đủ thông tin");
  //       } else {
  //         toast.warn("Missing input");
  //       }
  //       break;
  //     }
  //   }
  //   return isValid;
  // };
  const checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      { value: email, isValid: isValidEmail },
      { value: password, isValid: true }, // Nếu không có kiểm tra cho password
      { value: firstName, isValid: isValidFirstName },
      { value: lastName, isValid: isValidLastName },
      { value: phoneNumber, isValid: isValidPhoneNumber },
      { value: address, isValid: isValidAddress },
    ];

    for (let i = 0; i < arrCheck.length; i++) {
      if (!arrCheck[i].value || !arrCheck[i].isValid) {
        isValid = false;
        if (language === "vi") {
          toast.warn("Bạn chưa nhập đủ thông tin hoặc sai định dạng yêu cầu");
        } else {
          toast.warn("Missing input");
        }
        break;
      }
    }
    return isValid;
  };


  const handleSaveUser = () => {
    let isValid = checkValidateInput();
    if (isValid === false) return;

    //fire redux create user
    dispatch(actions.createNewUser({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      address: address,
      phonenumber: phoneNumber,
      gender: gender,
      roleId: role,
      positionId: position,
      avatar: avatar,
      status: status
    }));

    // setTimeout(function () { window.location.href = '/admin-dashboard/user'; }, 1000);

  };

  return (
    <div>
      <div className="title mb-60">
        <FormattedMessage id="manage-user.title-create-user" />
      </div>
      <div className="row">
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.email" />
          </label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(event) => {
              onChangeInput(event, "email");
            }}
            disabled={
              action === CRUD_ACTIONS.EDIT ? true : false
            }
          />
          {!isValidEmail && (
            <span style={{ color: 'red' }}>
              <FormattedMessage id="login.title1" />
            </span>
          )}
        </div>
        <div className="col-3">
          <label>
            <FormattedMessage id="manage-user.password" />
          </label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(event) => {
              onChangeInput(event, "password");
            }}
            disabled={
              action === CRUD_ACTIONS.EDIT ? true : false
            }
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
            <FormattedMessage id="manage-user.add" />
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

