import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import { getAllSpecialty } from "../../../services/userService";

import Slider from "react-slick";
import { withRouter } from "react-router";
import { LANGUAGES } from "../../../utils";
class Specialty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSpecialty: [],
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty({ limit: 4 });
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  handleClickSeeMoreSpecialty = () => {
    this.props.history.push(`/list-specialty`);
  };

  handleLoadMore = async () => {
    let total = this.state.dataSpecialty.length + 4;
    let res = await getAllSpecialty({ limit: total });
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }


  render() {
    let { dataSpecialty } = this.state;
    let { language } = this.props
    return (
      <div className="row">
        <div className="col-12">
          <div className="section-share section-specialty">
            <div className="section-container">
              <div className="section-header">
                <span className="title-section">
                  <FormattedMessage id="homepage.specialty-popular" />
                </span>
                <button
                  className="btn-section"
                  onClick={() => this.handleClickSeeMoreSpecialty()}
                >
                  <FormattedMessage id="homepage.more-infor" />
                </button>
              </div>

              <div className="row">
                {
                  dataSpecialty &&
                  dataSpecialty.length > 0 && dataSpecialty.map((item, index) => {
                    return (
                      <div className="col-lg-3 col-auto my-10" key={index}>
                        <div className="card-bs-custom pointer" onClick={() => this.handleViewDetailSpecialty(item)}>
                          <figure className="bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${item.image})`,
                            }}></figure>
                          <div className="card-body">
                            <h3 className="mb-5 font-weight-normal pointer specialty-name fs-15" >{language === LANGUAGES.VI ? item.name : item.nameEn}</h3>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
              {/* <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary my-15" onClick={() => this.handleLoadMore()}>{this.props.language=="en" ? "Load more" : "Tải thêm"}</button>
              </div> */}

              {/* <div className="section-body">
                <Slider {...this.props.settings}>
                  {dataSpecialty &&
                    dataSpecialty.length > 0 &&
                    dataSpecialty.map((item, index) => {
                      return (
                        <div
                          className="section-customize specialty-child"
                          key={index}
                          onClick={() => this.handleViewDetailSpecialty(item)}
                        >
                          <div
                            className="bg-image section-specialty"
                            style={{
                              backgroundImage: `url(${item.image})`,
                            }}
                          ></div>
                          <div className="specialty-name">{item.name}</div>
                        </div>
                      );
                    })}
                </Slider>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
