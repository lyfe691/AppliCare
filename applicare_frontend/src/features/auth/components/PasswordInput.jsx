import { Input } from 'antd';

// doesnt allow spaces in the password input
const PasswordInput = ({ placeholder, ...props }) => {
  return (
    <Input.Password
      {...props}
      placeholder={placeholder}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
        }
      }}
    />
  );
};

export default PasswordInput; 