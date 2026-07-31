
export const ForgotValidate = (values) => {
    let error = {};

    if (values.email === "") {
        error.email = "Email is required";
    }

    return error;
};