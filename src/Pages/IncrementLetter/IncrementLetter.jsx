import React from "react";
import "./IncrementLetter.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import Input from "../../comp/input/Input";
import { MenuItem } from "@mui/material";
import SelectInput from "../../comp/selectInput/SelectInput";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";
import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { FaGlobe } from "react-icons/fa";

const IncrementLetter = () => {
  return (
    <>
      <MainPanel>
        <div className="incrementletter-parent parent">
          <div className="incrementletter-cont cont">
            <div className="left-increment">
              <Input
                label="Offer-Letter Date"
                type="date"
                name="offer-letter-date"
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
              <Input
                label="Effective Date"
                type="date"
                name="Effective date"
                required
              />
              <Input label="Employee Name" name="employee name" required />
              <Input label="Previous CTC" name="Previous CTC" required />
              <Input
                label="Increment Percentage"
                name="Increment Percentage"
                required
              />
              <Input label="Revised CTC" name="Revised CTC" required />

              <Input label="Hr Manager Name" name="hr manager name" required />
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
            <div className="right-increment">
              <div className="increment-pdf-page">
                <img className="leftcorner" src={left_corner} alt="left-corner" />
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div className="top">
                  <div className="date">Date:01-03-19</div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                </div>
                <div className="heading">
                  <h3>Increment Letter</h3>
                </div>
                <div className="name">
                  <p>Dear</p>
                  <h4>KARTIK HATTE</h4>
                </div>
                <div className="gap"></div>
                <p>
                  We are pleased to inform you that, in recognition of your
                  continued hard work, dedication and valuable contributions to
                  <strong>Pandoza Solutions Pvt. Ltd.</strong> , your
                  compensation has been revised.
                </p>
                <div className="gap"></div>
                <p>
                  With effect from 01-03-19, your annual CTC has been revised
                  from <strong>₹6,00,000 to ₹6,60,000,</strong> representing an
                  increment of <strong>10%</strong>. The revised compensation
                  will be applicable from the effective date mentioned above.
                </p>
                <div className="gap"></div>
                <p>
                  All other terms and conditions of your employment remain
                  unchanged.
                </p>
                <div className="gap"></div>
                <p>
                  We truly appreciate your performance and look forward to your
                  continued contribution to the growth and success of
                  <strong>Pandoza Solutions Pvt. Ltd.</strong>
                </p>
                <div className="gap"></div>
                <p>
                  Congratulations and best wishes for your future endeavors!
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

export default IncrementLetter;
