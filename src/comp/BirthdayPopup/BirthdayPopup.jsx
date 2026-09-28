
import "./BirthdayPopup.scss";
import companyLogo from "../../assets/PandozaLogo.png";

const BirthdayPopup = ({
    open,
    notification,
    employee,
    onClose,
}) => {
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

    if (!open || !notification) {
        return null;
    }

    return (
        <div className="birthday-popup-overlay">
            <div className="birthday-popup-wrapper">

                <div className="birthday-popup-card">

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