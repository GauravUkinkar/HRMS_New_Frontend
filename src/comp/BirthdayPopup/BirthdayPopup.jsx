import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./BirthdayPopup.scss";
import companyLogo from "../../assets/PandozaLogo.png";

const BirthdayPopup = ({
    open,
    notification,
    employee,
    onClose,
}) => {
    const birthdayCardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    if (!open || !notification) {
        return null;
    }

    const employeeName = employee?.employeeName || "Employee";

    const employeeImage =
        employee?.employeeImage ||
        employee?.profileImage ||
        employee?.image ||
        "";

    const getInitials = (name) => {
        return String(name)
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const stripHtml = (html = "") => {
        const temp = document.createElement("div");
        temp.innerHTML = html;

        return temp.textContent || temp.innerText || "";
    };

    const notificationMessage = stripHtml(
        notification?.message || ""
    );

    const downloadBirthdayPDF = async () => {
        if (!birthdayCardRef.current || downloading) {
            return;
        }

        try {
            setDownloading(true);

            const card = birthdayCardRef.current;

            const canvas = await html2canvas(card, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const imageData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imageWidth = pageWidth - 30;
            const imageHeight =
                (canvas.height * imageWidth) / canvas.width;

            const positionX = 15;

            const positionY =
                imageHeight < pageHeight
                    ? (pageHeight - imageHeight) / 2
                    : 10;

            pdf.addImage(
                imageData,
                "PNG",
                positionX,
                positionY,
                imageWidth,
                imageHeight
            );

            const safeName = employeeName
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .trim()
                .replace(/\s+/g, "_");

            pdf.save(`Birthday_Wishes_${safeName}.pdf`);
        } catch (error) {
            console.error("Birthday PDF Download Error:", error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="birthday-popup-overlay">
            <div className="birthday-popup-wrapper">

                <button
                    type="button"
                    className="birthday-download-button"
                    onClick={downloadBirthdayPDF}
                    disabled={downloading}
                    title="Download birthday greeting"
                >
                    {downloading ? (
                        <span className="birthday-download-loader"></span>
                    ) : (
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 3v12" />
                            <path d="m7 10 5 5 5-5" />
                            <path d="M5 21h14" />
                        </svg>
                    )}
                </button>

                <div
                    ref={birthdayCardRef}
                    className="birthday-popup-card"
                >
                    <img
                        src={companyLogo}
                        alt=""
                        className="birthday-watermark"
                    />

                    <button
                        type="button"
                        className="birthday-popup-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>

                    <div className="birthday-top-line"></div>

                    <div className="birthday-company">
                        <img
                            src={companyLogo}
                            alt="Pandoza Solutions"
                            className="birthday-company-logo"
                        />

                        <div className="birthday-company-info">
                            <h3>Pandoza Solutions</h3>
                            <span>Private Limited</span>
                        </div>
                    </div>

                    <div className="birthday-content">

                        <div className="birthday-label">
                            <span></span>
                            EMPLOYEE RECOGNITION
                            <span></span>
                        </div>

                        <div className="birthday-icon">
                            🎂
                        </div>

                        <h1>
                            Happy Birthday
                        </h1>

                        <p className="birthday-subtitle">
                            Wishing you a wonderful birthday and another year
                            of growth, success and happiness.
                        </p>

                        <div className="birthday-employee-image">
                            {employeeImage ? (
                                <img
                                    src={employeeImage}
                                    alt={employeeName}
                                />
                            ) : (
                                <span>
                                    {getInitials(employeeName)}
                                </span>
                            )}
                        </div>

                        <h2>{employeeName}</h2>

                        <div className="birthday-message">
                            <div className="message-line"></div>

                            <p>
                                {notificationMessage ||
                                    `Wishing you a very Happy Birthday, ${employeeName}. May this year bring you new opportunities, continued growth and many memorable moments.`}
                            </p>

                            <div className="message-line"></div>
                        </div>

                        <div className="birthday-wishes">
                            <div>
                                <strong>Growth</strong>
                                <span>Keep learning</span>
                            </div>

                            <div>
                                <strong>Success</strong>
                                <span>Keep achieving</span>
                            </div>

                            <div>
                                <strong>Happiness</strong>
                                <span>Keep inspiring</span>
                            </div>
                        </div>

                        <div className="birthday-footer">
                            <p>
                                With warm wishes from
                            </p>

                            <strong>
                                Pandoza Solutions Pvt. Ltd.
                            </strong>
                        </div>

                        <button
                            type="button"
                            className="birthday-thank-button"
                            onClick={onClose}
                        >
                            Thank You
                            <span>→</span>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BirthdayPopup;