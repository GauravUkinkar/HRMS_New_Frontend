
export const ForgotValidate = (values) => {
    let error = {};

    if (values.email === "") {
        error.email = "Email is required";
    } else if (
  !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)
) {
  error.email = "Please enter a valid email address";
}

    return error;
};