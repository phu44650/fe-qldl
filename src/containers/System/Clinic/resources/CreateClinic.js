import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "../ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import { createNewClinic } from "../../../../services/userService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class CreateClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameEn: '',
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      descriptionHTMLEn: "",
      descriptionMarkdownEn: "",
    };
  }

  async componentDidMount() { }

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
  handleEditorChangeEn = ({ html, text }) => {
    this.setState({
      descriptionHTMLEn: html,
      descriptionMarkdownEn: text,
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

  checkValidateInputs = () => {
    let arrCheck = ["name", "nameEn", "address", "imageBase64", "descriptionHTML", "descriptionMarkdown", "descriptionHTMLEn", "descriptionMarkdownEn"]
    let copyState = { ...this.state }
    for (let i = 0; i < arrCheck.length; i++) {
      if (!copyState[arrCheck[i]]) return false
    }
    return true
  }

  handleSaveNewClinic = async () => {
    let { language } = this.state;
    let check = this.checkValidateInputs()
    if (!check) {
      if (language == "en") {
        toast.error("Hospital information is not complete!");
      } else {
        toast.error("Chưa điền đủ thông tin bệnh viện!");
      }
      return;
    }

    let res = await createNewClinic(this.state);
    console.log(this.state);

    if (res && res.errCode === 0) {
      if (language == "en") {
        toast.success("Add new hospital successfully!");
      } else {
        toast.success("Thêm bệnh viện thành công!");
      }

      this.setState({
        name: "",
        nameEn: "",
        imageBase64: "",
        address: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        descriptionHTMLEn: "",
        descriptionMarkdownEn: "",
      });
    } else {
      if (language == "en") {
        toast.error("Something wrongs!");
      } else {
        toast.error("Lỗi!");
      }
    }

    setTimeout(function () { window.location.href = '/admin-dashboard/manage-clinic' }, 1000);
  };

  render() {
    let { language } = this.state;
    return (
      <div className="manage-specialty-container">
        <div className="ms-title"><FormattedMessage id={"admin.manage-clinic.title-create"} /></div>

        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label><FormattedMessage id={"admin.manage-clinic.hospital-name"} /></label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-6 form-group">
            <label><FormattedMessage id={"admin.manage-clinic.hospital-avatar"} /></label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnChangeImage(event)}
            />
          </div>
          <div className="col-6 form-group">
            <label><FormattedMessage id={"admin.manage-clinic.hospital-nameEn"} /></label> 
          
            <input
              className="form-control"
              type="text"
              value={this.state.nameEn}
              onChange={(event) => this.handleOnChangeInput(event, "nameEn")}
            />
          </div>
          <div className="col-6 form-group">
            <label><FormattedMessage id={"admin.manage-clinic.hospital-address"} /></label>
            <input
              className="form-control"
              type="text"
              value={this.state.address}
              onChange={(event) => this.handleOnChangeInput(event, "address")}
            />
          </div>

          <div className="col-12"> <label><FormattedMessage id={"admin.manage-clinic.markdown"} /></label>
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>
          <div className="col-12 mt-20"> <label><FormattedMessage id={"admin.manage-clinic.markdownEn"} /></label>
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChangeEn}
              value={this.state.descriptionMarkdownEn}
            />
          </div>
          <div className="col-12">
            <button
              className="btn btn-primary mt-30"
              onClick={() => this.handleSaveNewClinic()}
            >
              {language == "en" ? "Create" : "Thêm"}
            </button>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateClinic);
