import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";

import { createNewClinic } from "../../../services/userService";
import { filterClinics, deleteClinic, filterClinicsEn } from "../../../services/clinicService";

import { toast } from "react-toastify";
import { withRouter } from '../../../utils/withRouter';
import { injectIntl } from 'react-intl';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameEn: '',
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      listClinics: []
    };
  }

  async componentDidMount() {
    await this.getAllClinics({})
  }

  async getAllClinics() {
    let res = await filterClinics({})
    if (res && res.errCode === 0) {
      console.log("res", res)
      let allClinics = res.data.reverse()
      this.setState({
        listClinics: allClinics
      })
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);

      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveNewClinic = async () => {
    let res = await createNewClinic(this.state);
    if (res && res.errCode === 0) {
      if (this.props.language === "en") {
        toast.success("Add new hospital succeeds!");
      } else {
        toast.success("Thêm bệnh viện thành công!");
      }

      this.setState({
        name: "",
        imageBase64: "",
        address: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
    } else {
      if (this.props.language === "en") {
        toast.error("Something wrongs!");
      } else {
        toast.error("Lỗi!");
      }
    }
  };



  handleDeleteClinic = async (clinicId) => {
    let { language } = this.props;

    // Hiển thị cửa sổ xác nhận sử dụng SweetAlert2
    const result = await Swal.fire({
      title: language === "en" ? 'Confirm Delete' : 'Xác nhận Xóa',
      text: language === "en" ? 'Are you sure you want to delete this hospital?' : 'Bạn có chắc muốn xóa bệnh viện này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: language === "en" ? 'Yes' : 'Có',
      cancelButtonText: language === "en" ? 'No' : 'Không',
      allowOutsideClick: false,
    });

    // Kiểm tra xem người dùng đã xác nhận xóa hay không
    if (result.isConfirmed) {
      // Thực hiện xóa bệnh viện
      let res = await deleteClinic({ id: clinicId });

      if (res && res.errCode === 0) {
        if (language === "en") {
          toast.success("Delete hospital successfully!");
        } else {
          toast.success("Xóa bệnh viện thành công!");
        }
        await this.getAllClinics();
      } else {
        await this.getAllClinics();
        if (language === "en") {
          toast.error("Something went wrong!");
        } else {
          toast.error("Có lỗi xảy ra!");
        }
      }
    }
  }


  onChangeInput = (event, id) => {
    let copyState = { ...this.state };

    copyState[id] = event.target.value;

    this.setState({
      ...copyState,
    });
  };

  handleFilterClinis = async () => {

    let {
      name,
      address,
    } = this.state;

    let data = {
      name: name,
      address: address,
    }

    let res = await filterClinics(data)

    if (res && res.data) {
      let allClinics = res.data.reverse()
      this.setState({
        listClinics: allClinics
      })
    }
  }


  handleFilterClinisEn = async () => {

    let data = {
      nameEn: this.state.nameEn,
      address: this.state.address
    }
    let res = await filterClinicsEn(data)

    if (res && res.data) {
      let allClinics = res.data.reverse()
      this.setState({
        listClinics: allClinics
      })
    }
  }
  //   
  //     })
  //   }
  // }
  // }


  handleReset = async () => {
    this.setState({
      name: "",
      address: "",
    });

    await this.getAllClinics()

  }

  render() {
    let { listClinics } = this.state;
    let { language } = this.props;
    console.log("listClinics", listClinics)

    return (
      <div className="manage-specialty-container">
        <div className="ms-title">{language === "en" ? "HOSPITAL MANAGEMENT" : "QUẢN LÝ BỆNH VIỆN"}</div>

        <div className="row">
          <div className="col-12">
            <h3><FormattedMessage id="medical-history.filters" /></h3>
          </div>
          <div className="col-3">
            {language === LANGUAGES.VI ?
              <>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1"> <FormattedMessage id="admin.manage-clinic.hospital-name" /></label>
                  <input value={this.state.name} onChange={(event) => this.onChangeInput(event, "name")} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="" />
                </div>
              </>
              : <>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1"> <FormattedMessage id="admin.manage-clinic.hospital-name" /></label>
                  <input value={this.state.nameEn} onChange={(event) => this.onChangeInput(event, "nameEn")} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="" />
                </div>
              </>
            }
          </div>
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1"> <FormattedMessage id="admin.manage-clinic.hospital-address" /></label>
              <input value={this.state.address} onChange={(event) => this.onChangeInput(event, "address")} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="" />
            </div>
          </div>
          <div className="col-12">
            {language === LANGUAGES.VI ?
              <>
                <button onClick={() => this.handleFilterClinis()} type="button" className="btn btn-primary mr-5"><FormattedMessage id="medical-history.apply" /></button>
                <button onClick={() => this.handleReset()} type="button" className="btn btn-primary"><FormattedMessage id="medical-history.reset" /></button>
              </>
              : <>
                <button onClick={() => this.handleFilterClinisEn()} type="button btn-1" className="btn btn-primary mr-5"><FormattedMessage id="medical-history.apply" /></button>
                <button onClick={() => this.handleReset()} type="button" className="btn btn-primary"><FormattedMessage id="medical-history.reset" /></button>
              </>
            }

          </div>
        </div>

        <div className="row">
          <div className="col-12 text-right mb-16">
            <button type="submit" className="btn btn-primary pointer mr-5"
              onClick={() => { this.props.navigate(`/admin-dashboard/manage-clinic/create`, { replace: true }); }}
            ><i className="fas fa-plus-circle mr-5"></i><FormattedMessage id="manage-user.btn-create" /></button>
            {/* <button type="submit" className="btn btn-primary pointer" onClick={()=>handleReload()}><i className="fas fa-sync-alt mr-5"></i><FormattedMessage id="medical-history.reset" /></button> */}
          </div>
        </div>

        <table className="table table-striped mt-30">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col"><FormattedMessage id="admin.manage-clinic.image" /></th>
              <th scope="col"><FormattedMessage id="admin.manage-clinic.name" /></th>
              <th scope="col"><FormattedMessage id="admin.manage-clinic.address" /></th>
              <th scope="col" className="">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {
              listClinics.map((clinic, index) => {
                return (
                  <tr key={index}>
                    <td scope="row">{index + 1}</td>
                    <td style={{ backgroundImage: `url(${clinic.image})`, width: "100px", height: "100px", backgroundSize: 'cover' }}></td>
                    <td>{language === LANGUAGES.VI ? clinic.name : clinic.nameEn}</td>
                    <td>{clinic.address}</td>
                    <td className="" colSpan="2">
                      <button
                        className="btn-edit"
                        onClick={() => { this.props.navigate(`/admin-dashboard/manage-clinic/edit/${clinic.id}`, { replace: true }); }}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => this.handleDeleteClinic(clinic.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

        {/* <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên phòng khám</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh phòng khám</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnChangeImage(event)}
            />
          </div>

          <div className="col-6 form-group">
            <label>Địa chỉ phòng khám</label>
            <input
              className="form-control"
              type="text"
              value={this.state.address}
              onChange={(event) => this.handleOnChangeInput(event, "address")}
            />
          </div>

          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>
          <div className="col-12">
            <button
              className="btn-save-specialty"
              onClick={() => this.handleSaveNewClinic()}
            >
              Save
            </button>
          </div>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageClinic)));
