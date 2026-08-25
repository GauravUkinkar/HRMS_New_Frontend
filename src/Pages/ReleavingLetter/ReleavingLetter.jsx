import React from 'react'
import MainPanel from '../../comp/MainPanel/MainPanel'
import "./ReleavingLetter.scss"
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

const ReleavingLetter = () => {
  return (
    <>
    <MainPanel>
          <div className="releavingletter-parent parent">
                  <div className="releavingletter-cont cont">
                    <div className="left-releaving">
                      <Input
                        label="Releaving-Letter Date"
                        type="date"
                        name="Releaving-letter-date"
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
                    <div className="right-releaving">
                      <div className="releaving-pdf-page">
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
                          <h3>Releaving Letter</h3>
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
                         We hereby confirm that he has been relieved from his duties with the organization with effect from <strong>25-08-2026</strong>, after completing all the required formalities and handing over his responsibilities
                        </p>
                        <div className="gap"></div>
                        <p>
                          During his tenure with the organization, his conduct and performance were found to be satisfactory.
                        </p>
                        <div className="gap"></div>
                        <p>
                          We appreciate his contributions to the organization and wish him all the very best in his future endeavors.
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

export default ReleavingLetter
