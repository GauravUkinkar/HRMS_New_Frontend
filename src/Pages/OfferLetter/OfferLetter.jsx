import React from "react";
import "./OfferLetter.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { LuDownload } from "react-icons/lu";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";

const OfferLetter = () => {
  return (
    <>
      <MainPanel>
        <div class="offerletter-parent parent">
          <div class="offerletter-cont cont">
            <div class="sub-header">
              <h2>View Offer</h2>
              <Button>
                Download <LuDownload />
              </Button>
            </div>
            <div class="pages-wrapper">
              <div class="offer-pdf-page">
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div class="top">
                  <div class="date">Date:01-03-19</div>
                  <div class="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                </div>
                <div class="heading">
                  <h3>Letter of Offer</h3>
                </div>
                <div class="name">
                  <p>Dear</p>
                  <h4>KARTIK HATTE</h4>
                </div>
                <div class="gap"></div>
                <p>
                  Further to your interview, we are pleased to offer you the
                  position of <strong>MANAGER</strong> in our organization.
                  Please refer to the attached Annexure-1 for your salary
                  structure and an explanation of its components.
                </p>
                <div class="gap"></div>
                <p>
                  On joining, you will be subject to the employee policies and
                  practices of <strong>Pandoza Solutions Pvt. Ltd.</strong>. A
                  summary of the present policies is included in Annexure-2 to
                  this offer letter for your reference. Also, refer to
                  Annexure-3 for the list of documents to be submitted at the
                  time of your joining.
                </p>
                <div class="gap"></div>
                <p>
                  You are required to join duties with effect from
                  <strong>01-03-19</strong>at our Pune office for this offer to
                  be valid. You will be on probation for a period of 3 months.
                </p>
                <div class="gap"></div>
                <p>
                  Kindly report at the following address, at 10:00 a.m. on your
                  date of joining –
                </p>
                <div class="gap"></div>
                <div class="address">
                  <h4>Pandoza Solutions Pvt. Ltd.</h4>
                  <p>214, 10 Biz Park, Viman Nagar,</p>
                  <p>Pune, Maharashtra, 411014</p>
                </div>
                <div class="gap"></div>
                <p>
                  Pandoza Solutions Pvt. Ltd. holds the right to cancel this
                  offer with or without a reason at any time before you
                  join.Pandoza Solutions Pvt. Ltd. may defer and/or cancel this
                  offer at any time before or after your joining in case any
                  information furnished by you is found incorrect or misleading.
                </p>
                <div class="gap"></div>
                <p>
                  We look forward to your joining Pandoza Solutions Pvt. Ltd. at
                  the earliest and wish you a successful career with us.{" "}
                </p>
                <div class="gap"></div>
                <p>Thanking you,</p>
                <p>Sincerely</p>
                <p>For Pandoza Solutions Pvt. Ltd.. </p>
                <div class="gap"></div>
                <div class="gap"></div>
                <div class="gap"></div>
                <div class="gap"></div>
                <p>Hr Admin & Finance</p>
                <p>Gaurav Ukinkar</p>
                <div class="gap"></div>
                <div class="gap"></div>
                <p class="footer">
                  214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                  76666 01972
                </p>
                <div class="gap"></div>
              </div>
              <div class="salary-pdf-page">
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div class="logo">
                  <img src={logo_pan} alt="OfferLogoPan" />
                </div>
                <div class="top">
                  <h3>ANNEXURE-1</h3>
                  <div class="small-gap"></div>
                  <h3>SALARY BREAKUP</h3>
                </div>
                <div class="gap"></div>
                <div class="info">
                  <p>
                    <span>
                      Name:<span>Kartik Hatte</span>
                    </span>
                  </p>
                  <p>
                    <span>Designation:MANAGER </span>
                  </p>
                  <p>
                    <span>Date of Joining:2019-03-01 </span>
                  </p>
                  <p>
                    <span>Department:</span>
                  </p>
                  <p>
                    <span>Location: Pune</span>
                  </p>
                </div>
                <div class="gap"></div>
                <div class="gap"></div>
                <table className="salary-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Component of Salary</th>
                      <th>Amount Rs (Monthly)</th>
                      <th>Amount Rs(Annually)</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>A</td>
                      <td>
                        <strong>Monthly Salary components</strong>
                      </td>
                      <td>20,000/-</td>
                      <td>2,40,000/-</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>Basic</td>
                      <td>10,000/-</td>
                      <td>1,20,000/-</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>DA</td>
                      <td>4,000/-</td>
                      <td>48,000/-</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>HRA</td>
                      <td>2,000/-</td>
                      <td>24,000/-</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>Other Allowance</td>
                      <td>4,000/-</td>
                      <td>48,000/-</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>
                        <strong>ANNUAL FIXED GROSS SALARY (A)</strong>
                      </td>
                      <td>
                        <strong>20,000/-</strong>
                      </td>
                      <td>
                        <strong>2,40,000/-</strong>
                      </td>
                    </tr>

                    <tr>
                      <td>B</td>
                      <td>
                        <strong>Deduction</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>Professional Tax*</td>
                      <td>200/-</td>
                      <td>2,500/-</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>Provident Fund (PF)**</td>
                      <td>1,800/-</td>
                      <td>21,600/-</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>
                        <strong>TOTAL DEDUCTION (B)</strong>
                      </td>
                      <td>
                        <strong>2,000/-</strong>
                      </td>
                      <td>
                        <strong>24,100/-</strong>
                      </td>
                    </tr>

                    <tr>
                      <td>C</td>
                      <td>
                        <strong>COST TO COMPANY (A-B)</strong>
                      </td>
                      <td>
                        <strong>18,000/-</strong>
                      </td>
                      <td>
                        <strong>2,15,900/-</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="gap"></div>
                <p>
                  *Professional Tax deduction for the month of February will be
                  ₹300.
                </p>
                <div class="small-gap"></div>
                <p>
                  **The PF deduction consists of both employee and employer
                  contributions.
                </p>
                <p class="footer">
                  214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                  76666 01972
                </p>
              </div>
              <div class="terms-condition-page">
                <div class="gap"></div>
                <div class="gap"></div>
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div class="logo">
                  <img src={logo_pan} alt="OfferLogoPan" />
                </div>
                <div class="gap"></div>
                <h4>Explanation of terms used:</h4>
                <div class="gap"></div>
                <div class="salary-description">
                  <p>
                    <strong>I. Basic :</strong> This is the base component of
                    the salary to which many other components are linked. The
                    amount is fully taxable.
                  </p>
                </div>
                <div class="gap"></div>
                <div class="salary-description">
                  <p>
                    <strong>II. HRA :</strong> This amount will not be taxable
                    if you submit the appropriate rent agreement and rent
                    receipts. Tax benefit calculation will be done on the basis
                    of provisions of the Income Tax Act, of 1961.
                  </p>
                </div>
                <div class="gap"></div>
                <div class="salary-description">
                  <p>
                    <strong>III. Special Allowance :</strong> This will vary as
                    it is based on the difference between your gross salary and
                    other components that make up the entire salary. It is a
                    fully taxable component.
                  </p>
                </div>
                <div class="gap"></div>
                <div class="salary-description">
                  <p>
                    <strong>Income Tax :</strong> Income tax and Professional
                    tax will be deducted at source as per the rules applicable.
                    The information pertaining to compensation and benefits is
                    personal and confidential in nature. You should maintain the
                    confidentiality of your compensation details and any
                    increments.
                  </p>
                </div>
                <div class="gap"></div>
                <p class="footer">
                  214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                  76666 01972
                </p>
              </div>
              <div class="eight-twelve-page">
                <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                <div class="gap"></div>
                <div class="gap"></div>
                <div class="logo">
                  <img src={logo_pan} alt="OfferLogoPan" />
                </div>
                <div class="top">
                  <h3>ANNEXURE-2</h3>
                  <h3> Additional Terms and Conditions of Offer</h3>
                </div>
                <div class="gap"></div>
                <strong>1. Date of joining:</strong>
                <div class="small-gap"></div>
                <p>
                  This offer for employment is subject to your joining and
                  reporting to the designated Pandoza Solutions Pvt. Ltd.
                  location onfailing which this offer will stand withdrawn. In
                  case of such withdrawal of the offer,Pandoza Solutions Pvt.
                  Ltd. reserves the right to re-consider or reject your
                  employment with Pandoza Solutions Pvt. Ltd..{" "}
                </p>
                <div class="gap"></div>
                <strong>2. Work location and transfer:</strong>
                <div class="small-gap"></div>
                <p>Your initial location after joining will be at Pandoza Solutions Pvt. Ltd.<strong>Pune</strong> office. This offer is subject to your preparedness to work in any of the locations of Pandoza Solutions Pvt. Ltd. or its affiliates. Your services are transferable and you may be assigned to any office of Pandoza Solutions Pvt. Ltd. or an associate company on such project as Pandoza Solutions Pvt. Ltd. may deem suitable </p>
                <div class="gap"></div>
                <strong>3. Mandatory tenure of employment:</strong>
                <div class="small-gap"></div>
                <p>On joining Pandoza Solutions Pvt. Ltd., you will continue to be employed with Pandoza Solutions Pvt. Ltd. for a minimum period of one year. If you resign or are terminated by Pandoza Solutions Pvt. Ltd. for cause prior to completion of the said one year, you will be liable to pay Pandoza Solutions Pvt. Ltd. damages equivalent to three times your monthly gross salary. If failed to do so, Pandoza Solutions Pvt. Ltd. will file legal action against the employee. Further, if you resign or are terminated by Pandoza Solutions Pvt. Ltd. for cause prior to completion of the said one year, any special expenses incurred by Pandoza Solutions Pvt. Ltd. on your joining such as joining bonus, hiring allowance, notice buy-out, etc. will be recovered from you, in addition to the damages mentioned above.</p>
                <div class="gap"></div>
                <strong> Background verification:</strong>
                <div class="small-gap"></div>
                <p>This offer for employment is subject to the satisfactory completion of your background reference check, which includes verification of your past employment details based on the documents and information furnished by you at the time of joining Pandoza Solutions Pvt. Ltd. and verification of all other documents submitted by you as a reference for your educational qualifications or any other credentials. In case you are unable to furnish the necessary documents and information for completing your background reference check or in case you furnish any misleading information or false documents, Pandoza Solutions Pvt. Ltd. reserves the right to terminate your employment irrespective of anything to the contrary in the Company’s Policies.</p>
                <div class="gap"></div>
                      <p class="footer">
                  214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                  76666 01972
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default OfferLetter;
