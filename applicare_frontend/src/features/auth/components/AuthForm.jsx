// src/features/auth/components/AuthForm.jsx

import "../../../css/Auth.css";

function AuthForm({
  title,
  fields = [],
  onSubmit,
  error,
  success,
  buttonText = "Submit",
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
    <div className="auth-page">
      <div className="auth-container">
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
            />
          ))}
          <button type="submit">{buttonText}</button>
        </form>
        {children}
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}
        {success && (
          <div className="success-container">
            <p className="success-message">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
