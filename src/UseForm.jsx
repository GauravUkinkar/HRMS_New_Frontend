import { useEffect, useState } from "react";

const UseForm = (formObj, validate, callback) => {
  const [values, setValues] = useState(formObj);
  const [error, setError] = useState(formObj);
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleChange = (e) => {
  const { name, value, type, files } = e.target;

  setValues((prev) => ({
    ...prev,
    [name]: type === "file" ? files[0] : value, // Don't trim here
  }));
};

const handleBlur = (e) => {
  const { name, value } = e.target;

  setValues((prev) => ({
    ...prev,
    [name]: value.trim(), // Trim only on blur
  }));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setError(validationErrors);
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (isSubmitting && Object.keys(error).length === 0) {
      callback();
      setIsSubmitting(false);
    }
  }, [error, isSubmitting]);

  return {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    setValues,
    error,
    setError,
    isSubmitting,
  };
};

export default UseForm;
