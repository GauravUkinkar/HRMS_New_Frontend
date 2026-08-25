import React from "react";
import MainPanel from "../../comp/MainPanel/MainPanel";
import "./ExperienceLetter.scss";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";
import Input from "../../comp/input/Input";
import { FaGlobe, FaLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoIosMail } from "react-icons/io";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";
import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";

const ExperienceLetter = () => {
  return (
    <>
      <MainPanel>
        <div className="experienceletter-parent parent">
          <div className="experienceletter-cont cont">
            <div className="left-experience">
              <Input
                label="Experience-Letter Date"
                type="date"
                name="Experience-letter-date"
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
                label="Designation"
                name="Designation"
                required
              />
              <Input label="Joining Date" name="Joining Date" type="date" required />
              <Input
                label="Relieving Date"
                name="Relieving Date"
                type="date"
                required
              />
              <Input label="Hr Manager Name" name="hr manager name" required />
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
            <div className="right-experience">
              <div className="experience-pdf-page">
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
                  <h3>Experience Letter</h3>
                </div>
                <div className="name">
                  <p>Dear</p>
                  <h4>KARTIK HATTE</h4>
                </div>
                <div className="gap"></div>
                <p>
                This is to certify that Kartik Hatte was employed with <strong>Pandoza Solutions Pvt. Ltd.</strong> as a Software Developer from <strong>01-03-2023</strong> to <strong>25-08-2026</strong>.
                </p>
                <div className="gap"></div>
                <p>
                  During his tenure with the organization, he was responsible for carrying out his assigned duties and responsibilities efficiently and professionally.
                </p>
                <div className="gap"></div>
                <p>
                  We found him to be sincere, hardworking, dedicated, and committed towards his work. His conduct and performance during his employment were satisfactory.
                </p>
                <div className="gap"></div>
                <p>
                  We truly appreciate your performance and look forward to your
                  continued contribution to the growth and success of
                  <strong>Pandoza Solutions Pvt. Ltd.</strong>
                </p>
                <div className="gap"></div>
                <p>
                  We wish him all the very best for his future endeavors.
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

export default ExperienceLetter;
