import React from "react";
import "./OfferLetter.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { Link } from "react-router-dom";
import { LuDownload } from "react-icons/lu";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png";
import Input from "../../comp/input/Input";
import SelectInput from "../../comp/selectInput/SelectInput";
import { MenuItem } from "@mui/material";

const OfferLetter = () => {
  return (
    <>
      <MainPanel>
        <div className="offerletter-parent parent">
          {/* <div class="sub-header">
            <h2>View Offer</h2>
            <button className="btn">
              Download <LuDownload />
            </button>
          </div> */}
          <div className="offerletter-cont cont">
            <div className="left-offer">
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
                label="Joining Date"
                type="date"
                name="joining date"
                required
              />
              <Input label="Employee Name" name="employee name" required />
              <SelectInput
              label="Gender"
              name="gender"
              required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>

              </SelectInput>
              <Input label="Employee Designation" name="employee designation" required />
                       <SelectInput
              
                    name="employee type"
                    label="Employee Type"
                    required
                  >
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Freelance">Freelance</MenuItem>
                    <MenuItem value="Freelance">Intern</MenuItem>
                  </SelectInput>
              <Input label="Salary" name="salary" required />
              <Input label="Hr Manager Name" name="hr manager name" required />
                       <button className="btn" type="submit">
            Submit
          </button>


            </div>
            <div className="right-offer">
              <div className="pages-wrapper">
                <div className="offer-pdf-page">
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
                    <strong>01-03-19</strong>at our Pune office for this offer
                    to be valid. You will be on probation for a period of 3
                    months.
                  </p>
                  <div class="gap"></div>
                  <p>
                    Kindly report at the following address, at 10:00 a.m. on
                    your date of joining –
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
                    join.Pandoza Solutions Pvt. Ltd. may defer and/or cancel
                    this offer at any time before or after your joining in case
                    any information furnished by you is found incorrect or
                    misleading.
                  </p>
                  <div class="gap"></div>
                  <p>
                    We look forward to your joining Pandoza Solutions Pvt. Ltd.
                    at the earliest and wish you a successful career with
                    us.{" "}
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
                <div className="salary-pdf-page">
                  <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                  <div className="top">
                    <h3>ANNEXURE-1</h3>
                    <div className="small-gap"></div>
                    <h3>SALARY BREAKUP</h3>
                  </div>
                  <div className="gap"></div>
                  <div className="info">
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
                  <div className="gap"></div>
                  <div className="gap"></div>
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
                  <div className="gap"></div>
                  <p>
                    *Professional Tax deduction for the month of February will
                    be ₹300.
                  </p>
                  <div className="small-gap"></div>
                  <p>
                    **The PF deduction consists of both employee and employer
                    contributions.
                  </p>
                  <p className="footer">
                    214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                    76666 01972
                  </p>
                </div>
                <div className="terms-condition-page">
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                  <div className="gap"></div>
                  <h4>Explanation of terms used:</h4>
                  <div className="gap"></div>
                  <div className="salary-description">
                    <p>
                      <strong>I. Basic :</strong> This is the base component of
                      the salary to which many other components are linked. The
                      amount is fully taxable.
                    </p>
                  </div>
                  <div className="gap"></div>
                  <div className="salary-description">
                    <p>
                      <strong>II. HRA :</strong> This amount will not be taxable
                      if you submit the appropriate rent agreement and rent
                      receipts. Tax benefit calculation will be done on the
                      basis of provisions of the Income Tax Act, of 1961.
                    </p>
                  </div>
                  <div className="gap"></div>
                  <div className="salary-description">
                    <p>
                      <strong>III. Special Allowance :</strong> This will vary
                      as it is based on the difference between your gross salary
                      and other components that make up the entire salary. It is
                      a fully taxable component.
                    </p>
                  </div>
                  <div className="gap"></div>
                  <div className="salary-description">
                    <p>
                      <strong>Income Tax :</strong> Income tax and Professional
                      tax will be deducted at source as per the rules
                      applicable. The information pertaining to compensation and
                      benefits is personal and confidential in nature. You
                      should maintain the confidentiality of your compensation
                      details and any increments.
                    </p>
                  </div>
                  <div className="gap"></div>
                  <p className="footer">
                    214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                    76666 01972
                  </p>
                </div>
                <div class="eight-twelve-page">
                  <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                  <div className="top">
                    <h3>ANNEXURE-2</h3>
                    <h3> Additional Terms and Conditions of Offer</h3>
                  </div>
                  <div className="gap"></div>
                  <strong>1. Date of joining:</strong>
                  <div className="small-gap"></div>
                  <p>
                    This offer for employment is subject to your joining and
                    reporting to the designated Pandoza Solutions Pvt. Ltd.
                    location onfailing which this offer will stand withdrawn. In
                    case of such withdrawal of the offer,Pandoza Solutions Pvt.
                    Ltd. reserves the right to re-consider or reject your
                    employment with Pandoza Solutions Pvt. Ltd..{" "}
                  </p>
                  <div className="gap"></div>
                  <strong>2. Work location and transfer:</strong>
                  <div className="small-gap"></div>
                  <p>
                    Your initial location after joining will be at Pandoza
                    Solutions Pvt. Ltd.<strong>Pune</strong> office. This offer
                    is subject to your preparedness to work in any of the
                    locations of Pandoza Solutions Pvt. Ltd. or its affiliates.
                    Your services are transferable and you may be assigned to
                    any office of Pandoza Solutions Pvt. Ltd. or an associate
                    company on such project as Pandoza Solutions Pvt. Ltd. may
                    deem suitable{" "}
                  </p>
                  <div className="gap"></div>
                  <strong>3. Mandatory tenure of employment:</strong>
                  <div className="small-gap"></div>
                  <p>
                    On joining Pandoza Solutions Pvt. Ltd., you will continue to
                    be employed with Pandoza Solutions Pvt. Ltd. for a minimum
                    period of one year. If you resign or are terminated by
                    Pandoza Solutions Pvt. Ltd. for cause prior to completion of
                    the said one year, you will be liable to pay Pandoza
                    Solutions Pvt. Ltd. damages equivalent to three times your
                    monthly gross salary. If failed to do so, Pandoza Solutions
                    Pvt. Ltd. will file legal action against the employee.
                    Further, if you resign or are terminated by Pandoza
                    Solutions Pvt. Ltd. for cause prior to completion of the
                    said one year, any special expenses incurred by Pandoza
                    Solutions Pvt. Ltd. on your joining such as joining bonus,
                    hiring allowance, notice buy-out, etc. will be recovered
                    from you, in addition to the damages mentioned above.
                  </p>
                  <div className="gap"></div>
                  <strong> Background verification:</strong>
                  <div className="small-gap"></div>
                  <p>
                    This offer for employment is subject to the satisfactory
                    completion of your background reference check, which
                    includes verification of your past employment details based
                    on the documents and information furnished by you at the
                    time of joining Pandoza Solutions Pvt. Ltd. and verification
                    of all other documents submitted by you as a reference for
                    your educational qualifications or any other credentials. In
                    case you are unable to furnish the necessary documents and
                    information for completing your background reference check
                    or in case you furnish any misleading information or false
                    documents, Pandoza Solutions Pvt. Ltd. reserves the right to
                    terminate your employment irrespective of anything to the
                    contrary in the Company’s Policies.
                  </p>
                  <div className="gap"></div>
                  <p className="footer">
                    214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                    76666 01972
                  </p>
                </div>
                <div className="new-page">
                  <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <strong>5. Travel and passport:</strong>
                  <div className="small-gap"> </div>
                  <p>
                    You should possess a valid passport during your employment
                    with Pandoza Solutions Pvt. Ltd.. In case you do not have a
                    valid passport at the time of joining, you should get one
                    issued within three months from the date of joining.
                  </p>
                  <div className="gap"></div>
                  <strong>6. Confidentiality and return of materials:</strong>
                  <div className="small-gap"></div>
                  <p>
                    You will be required to maintain organizational secrecy and
                    confidentiality with respect to information and procedures
                    followed in Pandoza Solutions Pvt. Ltd.. You should not
                    disclose any information/materials that are the intellectual
                    property of Pandoza Solutions Pvt. Ltd., its associate
                    companies, or clients. Upon resignation or termination of
                    your employment, you will return to Pandoza Solutions Pvt.
                    Ltd. all papers and documents which may at that time be in
                    your possession. This includes all types of material related
                    to the business of Pandoza Solutions Pvt. Ltd. or any of its
                    associates or branches and you will not retain any copies or
                    extracts therefrom.
                  </p>
                  <div className="gap"></div>
                  <strong>7. Non-competition:</strong>
                  <div className="small-gap"></div>
                  <p>
                    During the term of your employment with Pandoza Solutions
                    Pvt. Ltd., you will not engage in any other employment,
                    occupation, consulting, or other business activity related
                    to the business in whichPandoza Solutions Pvt. Ltd. 214, 10
                    BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91 76666
                    01972 Private Limited is now involved or becomes involved
                    during the term of your employment. You will not engage in
                    any other activity that conflicts with your obligations to
                    Pandoza Solutions Pvt. Ltd. during the term of your
                    employment and for one year thereafter without the prior
                    written consent of Pandoza Solutions Pvt. Ltd..
                  </p>
                  <div className="gap"></div>
                  <strong>8. Leaves and holidays:</strong>
                  <div className="small-gap"></div>
                  <p>
                    The company will announce the list of holidays at the
                    beginning of each calendar year. Employees are entitled to{" "}
                    <strong>two paid leaves per month</strong>, which must be
                    accrued before they can be availed.
                  </p>
                  <div className="small-gap"></div>
                  <p>
                    To request a leave, employees are required to
                    <strong>
                      submit their leave application at least four days in
                      advance
                    </strong>
                    for it to be considered.
                  </p>
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <strong>
                    *It Will be applicable after probation period.
                  </strong>
                  <p className="footer">
                    214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                    76666 01972
                  </p>
                </div>
                <div className="acceptance-page">
                  <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <strong>9. Dress code:</strong>
                  <div className="small-gap"></div>
                  <p>
                    The work dress code ranges from Formal to Business Casual to
                    Casual. Pandoza Solutions Pvt. Ltd.’s objective in
                    establishing a dress code is to allow our employees to work
                    comfortably in the workplace while projecting a professional
                    image not only to our customers, potential employees,
                    community, and visitors but also within the organization.
                    Since all casual clothing is not suitable for the office,
                    the dress code is specified in the employee manual to help
                    you determine what is appropriate to wear to work. You
                    should adhere to the dress code published in the employee
                    manual on the intranet.
                  </p>
                  <div className="gap"></div>
                  <p> You are required to wear formal on your date of joining, which
                  is:
                  <br />
                  <strong>* For Gentlemen</strong>: Formal full-sleeve shirts
                  and trousers with a tie and polished formal shoes.
                  <strong>* For Ladies</strong>: Western formals, salwar-kameez
                  or formal saris with sandals.</p>
                 
                  <div className="gap"></div>
                  <strong>10. Termination and resignation:</strong>
                  <div className="small-gap"></div>
                  <div className="a-point">
                    <p> A.
                    <strong>Termination :</strong>
                    Pandoza Solutions Pvt. Ltd.reserves the right to terminate
                    the services of an employee :</p>
                   
                  </div>
                  <div className="small-gap"></div>
                  <div className="subpoints">
                    <p>
                      a. With or without cause by providing immediate
                      termination.
                    </p>
                    <div className="small-gap"></div>
                    <p>b. Without notice in the following cases:</p>
                    <div className="small-gap"></div>
                  </div>
                  <ul className="listing">
                    <li>
                      If the employee is absent or on unauthorized leave without
                      notice in writing or without sufficient reasons for 5 days
                      or more.
                    </li>

                    <div className="small-gap"></div>

                    <li>
                      If the employee goes on a strike or supports a strike in
                      contravention of any law for the time being in force{" "}
                      <br />
                      or
                    </li>

                    <div className="small-gap"></div>

                    <li>
                      The employee causes damage to the physical or intellectual
                      property of Pandoza Solutions Pvt. Ltd. or any of its
                      clients/associates.
                    </li>

                    <div className="small-gap"></div>
                  </ul>
                  <div className="a-point">
                    <div className="gap"></div>
                    <div className="gap"></div>
                    <p>B.
                    <strong>Resignation :</strong>
                    For resigning fromPandoza Solutions Pvt. Ltd., you are
                    required to serve a 1 months’ notice period as per the
                    policy of resignation after the completion of 1 year with
                    the employment and as applicable at the time of departure.
                    In case of a shortfall in the notice period, the relieving
                    date shall be the prerogative of the company and shall be
                    within the notice period. Further, the company reserves the
                    right to recover an amount equivalent to the consolidated
                    salary for the number of days of the shortfall.</p>
                  </div>
                  <p className="footer">
                    214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                    76666 01972
                  </p>
                </div>
                <div className="third-last-page">
                  <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <strong>11. Rules and regulations:</strong>
                  <div className="small-gap"></div>
                  <p>
                    You will be subject to all rules and regulations ofPandoza
                    Solutions Pvt. Ltd. that are in force and shall abide by
                    them until in employment with the organization. Pandoza
                    Solutions Pvt. Ltd. policies are updated from time to time.
                    You are expected to be aware of the company’s policies and
                    abide by them. Pandoza Solutions Pvt. Ltd. reserves the
                    right to modify any or all of the above terms and conditions
                    that shall be binding on you, from time to time. You will be
                    governed by the code of conduct, discipline, rules, and
                    regulations as laid down by the Company. These can be
                    modified and updated from time to time, and these will be
                    deemed to form an integral part of this offer of employment.
                  </p>
                  <div className="gap"></div>
                  <strong>12. Acceptance:</strong>
                  <p>
                    If the terms and conditions of this offer are acceptable to
                    you, kindly return a duplicate of this letter of offer duly
                    signed with your acceptance. Originals and photocopies of
                    the following documents need to be submitted on the day of
                    joining. Non- submission of any of the documents will lead
                    to deferment of joining formalities. Original documents will
                    be returned after verification.
                  </p>
                  <div className="small-gap"></div>
                  <div className="small-gap"></div>
                  <p>
                    Before the date of joining, kindly forward a copy of your
                    resignation letter and the acceptance of the same from your
                    HR
                    <a href="mailto:info@pandozasolutions.com" target="_blank">
                      info@pandozasolutions.com
                    </a>
                    You can also mail us at
                    <a href="mailto:info@pandozasolutions.com" target="_blank">
                      info@pandozasolutions.com
                    </a>
                    if you have any queries.
                  </p>
                  <p className="footer">
                    214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                    76666 01972
                  </p>
                </div>
                <div className="secondlast-page">
                  <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <div className="top">
                    <h3>ANNEXURE-3</h3>
                  </div>
                  <div className="gap"></div>
                  <div className="small-gap"></div>
                  <ul className="edu-doc">
                    <h3> Educational documents:</h3>
                    <div className="small-gap"></div>
                    <li> 10th and 12th/Diploma mark sheets</li>
                    <div className="small-gap"></div>
                    <li>
                      Degree certificate and mark sheet (all semesters/years)
                    </li>
                    <div className="small-gap"></div>
                    <li>
                      PG certificate and mark sheet (if applicable – for all
                      semesters/years)
                    </li>
                    <div className="small-gap"></div>
                    <li>Any Certification mark sheet/certificate</li>
                  </ul>
                  <ul className="emp-doc">
                    <h3> Employment documents:</h3>
                    <div className="small-gap"></div>
                    <li>
                      {" "}
                      Relieving and Experience letters from past employers
                    </li>
                    <div className="small-gap"></div>
                    <li>Last 3 salary slips</li>
                    <div className="small-gap"></div>
                    <li>
                      Salary proof of fixed and variable components
                      (appointment/increment letter)
                    </li>
                    <div className="small-gap"></div>
                    <li>
                      Bank statement for last 3 months (if working on contract)
                    </li>
                  </ul>
                  <ul className="emp-doc">
                    <h3> Personal documents:</h3>
                    <div className="small-gap"></div>
                    <li> Marriage certificate (if applicable)</li>
                    <div className="small-gap"></div>
                    <li>3 passport-size photographs</li>
                    <div className="small-gap"></div>
                    <li>Passport Copy (If Applicable)</li>
                    <div className="small-gap"></div>
                    <li> PAN (Permanent Account Number) Card</li>
                    <div className="small-gap"></div>
                    <li> Aadhar Card</li>
                  </ul>
                  <div className="gap"></div>
                  <p>
                    Before the date of joining, kindly forward a copy of your
                    resignation letter and the acceptance of the same from your
                    HR to
                  </p>
                  <a href="mailto:info@pandozasolutions.com" target="_blank">
                    info@pandozasolutions.com
                  </a>
                  You can also mail us at
                  <a href="mailto:info@pandozasolutions.com" target="_blank">
                    info@pandozasolutions.com
                  </a>
                  if you have any queries.
                  <p className="footer">
                    214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                    76666 01972
                  </p>
                </div>
                <div className="last-page">
                  <img className="pan-water-mark" src={PanLogo} alt="PanLogo" />
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <div className="logo">
                    <img src={logo_pan} alt="OfferLogoPan" />
                  </div>
                  <div className="gap"></div>
                  <div className="gap"></div>
                  <div className="top">
                    <h3>ACCEPTANCE OF OFFER</h3>
                  </div>
                  <div className="gap"></div>
                  <div className="small-gap"></div>
                  <p>
                    I have read the offer letter and the annexed policies. I
                    hereby accept the offer on the aforesaid terms.
                  </p>
                  <div className="small-gap"></div>
                  <p>
                    I solemnly affirm that I am not under any medication on
                    account of any medical condition, which may adversely affect
                    the performance of my duties in the event of my appointment
                    pursuant to me acceptance of this offer.
                  </p>
                  <div className="small-gap"></div>
                  <p>
                    I shall join duties with effect from the date mentioned
                    hereinabove. In case of delays in joining, I shall inform
                    the concerned authority one week in advance in writing.
                  </p>
                  <div className="small-gap"></div>
                  <p>Name:</p>
                  <div className="small-gap"></div>
                  <p>Date:</p>
                  <div className="small-gap"></div>
                  <p>Signature:</p>
                  <div className="small-gap"></div>
                  <p>Place:</p>
                  <p className="footer">
                    214, 10 BIZ PARK, VIMANNAGAR, PUNE – 411014 | CONTACT: +91
                    76666 01972
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainPanel>
    </>
  );
};

export default OfferLetter;
