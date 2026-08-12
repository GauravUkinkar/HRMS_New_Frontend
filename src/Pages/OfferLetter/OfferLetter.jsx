import React from "react";
import "./OfferLetter.scss";
import MainPanel from "../../comp/MainPanel/MainPanel";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { LuDownload } from "react-icons/lu";
import PanLogo from "../../assets/pan-watermark.webp";
import logo_pan from "../../assets/offer-logo-pan.png"

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
                <div class="heading">
                    <div class="date">Date:01-03-19</div>
                    <div class="logo">
                        <img src={logo_pan} alt="OfferLogoPan"/>
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

export default OfferLetter;
