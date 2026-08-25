import React from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./PromotionLetter.scss";
import { FaGlobe, FaLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoIosMail } from "react-icons/io";
import Input from "../../comp/input/Input";
import { MenuItem } from "@mui/material";
import SelectInput from "../../comp/selectInput/SelectInput";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";
import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";

const PromotionLetter = () => {
  return (
    <>
      <MainPanel>
        <div className="promotionletter-parent parent">
          <div className="promotionletter-cont cont">
            <div className="left-promotion">
              <Input
                label="Promotion-Letter Date"
                type="date"
                name="Promotion-letter-date"
                required
              />
              <SelectInput
                name="select company name"
                label="Select Company Name"
                required
              >
                <MenuItem value="The Indian Journey">
                  The Indian Journey
                </MenuItem>
                <MenuItem value="Pandoza Solutions Pvt.Ltd.">
                  Pandoza Solutions Pvt.Ltd.
                </MenuItem>
                <MenuItem value="Akka Foundation">Akka Foundation</MenuItem>
                <MenuItem value="Nvm Infratech Pvt.Ltd">
                  Nvm Infratech Pvt.Ltd
                </MenuItem>
              </SelectInput>

              <Input label="Employee Name" name="employee name" required />
              <Input
                label="Previous Designation"
                name="Previous Designation"
                required
              />
              <Input label="New Designation" name="New Designation" required />
              <Input
                label="Promotion Effective Date"
                type="date"
                name="Promotion Effective date"
                required
              />
              <Input label="Hr Manager Name" name="hr manager name" required />
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
            <div className="right-promotion">
              <div className="promotion-pdf-page">
                <img
                  className="leftcorner"
                  src={left_corner}
                  alt="left-corner"
                />
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div className="top">
                  <div className="date">Date:01-03-19</div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                </div>
                <div className="heading">
                  <h3>Promotion Letter</h3>
                </div>
                <div className="name">
                  <p>Dear</p>
                  <h4>KARTIK HATTE</h4>
                </div>
                <div className="gap"></div>
                <p>
                  We are pleased to inform you that, in recognition of your
                  performance, dedication, and contribution to the organization,
                  you have been{" "}
                  <strong>
                    promoted to the position of Senior Software Developer
                  </strong>{" "}
                  at <strong>Pandoza Solutions Pvt. Ltd.</strong>, effective
                  from <strong>25-08-2026</strong>.
                </p>
                <div className="gap"></div>
                <p>
                  During your tenure with the organization, you have
                  consistently demonstrated professionalism, commitment, and a
                  strong sense of responsibility towards your assigned duties.
                </p>
                <div className="gap"></div>
                <p>
                  We appreciate your valuable contributions and are confident
                  that you will continue to perform with the same dedication and
                  commitment in your new role.
                </p>
                <div className="gap"></div>
                <p>
                  We wish you continued success and growth in your career with
                  <strong>Pandoza Solutions Pvt. Ltd.</strong>
                </p>
                <div className="gap"></div>

                <div className="gap"></div>
                <p>Thanking you,</p>
                <p>Sincerely</p>
                <h4>For Pandoza Solutions Pvt. Ltd.. </h4>
                <div className="gap"></div>
                <div className="gap"></div>
                <div className="gap"></div>
                <div className="gap"></div>
                <p>Hr Admin & Finance</p>
                <p>Gaurav Ukinkar</p>

                <div className="footer">
                  <Link className="left">
                    <div className="icon">
                      <FaLocationDot />
                    </div>
                    <div className="address">
                      <h4>Pandoza Solutions Pvt. Ltd.</h4>
                      <p>
                        214, 10 BIZ PARK,
                        <br /> VIMANNAGAR, PUNE – 411014 <br /> CONTACT: +91
                        76666 01972
                      </p>
                    </div>
                  </Link>
                  <div className="right">
                    <Link className="contact">
                      <div className="icon">
                        <FaPhoneVolume />
                      </div>
                      <p>+91 7666601972</p>
                    </Link>
                    <Link className="mail">
                      <div className="icon">
                        <IoIosMail />
                      </div>
                      <p>info@pandozasolutions.com</p>
                    </Link>
                    <Link className="globe">
                      <div className="icon">
                        <FaGlobe />
                      </div>
                      <p>+91 7666601972</p>
                    </Link>
                    <img src={right_corner} alt="right-corner" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default PromotionLetter;
