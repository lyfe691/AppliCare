import { Input } from 'antd';

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