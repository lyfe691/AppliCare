// src/features/auth/components/AuthForm.jsx

import styles from "../../../css/Auth.module.css";

function AuthForm({
  title,
  fields = [],
  onSubmit,
  error,
  success,
  buttonText = "Submit",
  disabled = false, // Default to false
  children,
}) {
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    for (let [key, val] of formData.entries()) {
      data[key] = val;
    }
    onSubmit && onSubmit(data);
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {title && <h2>{title}</h2>}
        <form onSubmit={handleSubmit}>
          {fields.map((f, i) => (
            <input
              key={i}
              type={f.type || "text"}
              name={f.name}
              placeholder={f.placeholder || ""}
              defaultValue={f.defaultValue || ""}
              required={f.required || false}
              disabled={disabled} //  disable input fields
            />
          ))}
          <button type="submit" disabled={disabled}>
            {buttonText}
          </button>
        </form>
        {children}
        {error && (
          <div className={styles.errorContainer}>
            <span className={styles.errorMessage}>{error}</span>
          </div>
        )}
        {success && (
          <div className={styles.successContainer}>
            <span className={styles.successMessage}>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
