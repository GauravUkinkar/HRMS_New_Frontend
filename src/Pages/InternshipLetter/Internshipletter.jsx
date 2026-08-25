import React from 'react'
import MainPanel from '../../comp/MainPanel/MainPanel'
import "./Intershipletter.scss"
import { FaGlobe, FaLocationDot, FaPhoneVolume } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { IoIosMail } from 'react-icons/io'
import Input from '../../comp/input/Input'
import { MenuItem } from '@mui/material'
import SelectInput from '../../comp/selectInput/SelectInput'
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";
import right_corner from "../../assets/right-corner.png";
import left_corner from "../../assets/left-corner.png";

const Internshipletter = () => {
  return (
    <>
    <MainPanel>
                <div className="internshipletter-parent parent">
          <div className="internshipletter-cont cont">
            <div className="left-internship">
              <Input
                label="Internship-Letter Date"
                type="date"
                name="Internship-letter-date"
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
           
              <Input label="Intern Name" name="intern name" required />
              <Input label="Internship Position" name="Internship Position" required />
              <Input
                label="Internship Start Date"
                type="date"
                name="Internship Start date"
                required
              />
                 <Input
                label="Internship End Date"
                type="date"
                name="Internship End date"
                required
              />

              <Input label="Hr Manager Name" name="hr manager name" required />
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
            <div className="right-internship">
              <div className="internship-pdf-page">
                <img className="leftcorner" src={left_corner} alt="left-corner" />
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div className="top">
                  <div className="date">Date:01-03-19</div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                </div>
                <div className="heading">
                  <h3>Internship Letter</h3>
                </div>
                <div className="name">
                  <p>Dear</p>
                  <h4>KARTIK HATTE</h4>
                </div>
                <div className="gap"></div>
                <p>
               We are pleased to inform you that you have been selected for an internship as a <strong>Senior Software Developer</strong> at <strong>Pandoza Solutions Pvt. Ltd.</strong> , effective from <strong>25-08-2026</strong> to <strong></strong> 25-11-2026.
                </p>
                <div className="gap"></div>
                <p>
                During your internship, you will have the opportunity to gain practical knowledge and hands-on experience related to your field of work. You will be expected to carry out the responsibilities assigned to you with dedication, professionalism, and sincerity.
                </p>
                <div className="gap"></div>
                <p>
                 We believe that this internship will provide you with valuable exposure and help you develop your professional skills and knowledge.
                </p>
                <div className="gap"></div>
                <p>
                  We wish you a successful and rewarding internship with
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
  )
}

export default Internshipletter
