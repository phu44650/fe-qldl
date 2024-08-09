import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DetailDoctor.scss";
import { getDetailInforDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";
class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
      currentDoctorId: -1,
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentDoctorId: id,
      });
      let res = await getDetailInforDoctor(id);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data,
        });
      }
      //   imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {

    }
  }

  render() {
    let { detailDoctor } = this.state;
    console.log(detailDoctor);
    let { language } = this.props;
    let nameVi = "",
      nameEn = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
      nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
    }

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container container">
          <div className="intro-doctor">
            <div
              className="content-left "
            // style={{
            //   backgroundImage: `url(${
            //     detailDoctor && detailDoctor.image ? detailDoctor.image : ""
            //   })`,
            // }}

            >
              <div className='image' style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}></div>
            </div>
            <div className="content-right">
              <div className="up">
                {language === LANGUAGES.VI ? nameVi : nameEn}
              </div>
              <div className="down">
                {detailDoctor &&
                  detailDoctor.Markdown &&
                  detailDoctor.Markdown?.description && language === LANGUAGES.VI
                  ? (
                    <span>{detailDoctor.Markdown?.description}</span>
                  )
                  :
                  (
                    <span>{detailDoctor.Markdown?.descriptionEn}</span>
                  )}
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
            </div>
            <div className="content-right">
              <DoctorExtraInfor
                doctorIdFromParent={this.state.currentDoctorId}
              />
            </div>
          </div>
          <div className="detail-infor-doctor">
            {detailDoctor &&
              detailDoctor.Markdown &&
              detailDoctor?.Markdown?.contentHTML && detailDoctor?.Markdown?.contentHTMLEn
              && this.props.language === LANGUAGES?.VI
              ? (
                <div //neu khong co thuoc tinh nay se in ra noi dung HTML
                  dangerouslySetInnerHTML={{
                    __html: detailDoctor?.Markdown?.contentHTML,
                  }}
                ></div>
              )
              :
              <div //neu khong co thuoc tinh nay se in ra noi dung HTML
                dangerouslySetInnerHTML={{
                  __html: detailDoctor?.Markdown?.contentHTMLEn,
                }}
              ></div>
              // (
              //   <div //neu khong co thuoc tinh nay se in ra noi dung HTML
              //     dangerouslySetInnerHTML={{
              //       __html: detailDoctor?.Markdown.contentHTMLEn,
              //     }}
              //   ></div>
              // )
            }
          </div>
          <div className="comment-doctor"></div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
