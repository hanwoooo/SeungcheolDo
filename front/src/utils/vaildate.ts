type UserInfomation = {
  email: string;
  password: string;
}

function validateUser(values: UserInfomation) {
  const errors = {
    email: '',
    password: '',
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }
  if (!(values.password.length >= 8 && values.password.length < 20)) {
    errors.password = '비밀번호는 8~20자 사이로 입력해주세요.';
  }
  return errors;
}

function validateLogin(values: UserInfomation) {
  return validateUser(values);
};

function validateSignup(values: UserInfomation & { userName: string, passwordConfirm: string }) {
  const errors = validateUser(values);
  const SignupErrors = {...errors, userName: '', passwordConfirm: ''};
  if (values.userName.length == 0) {
    SignupErrors.userName = '이름을 입력하세요.';
  }
  if (values.password !== values.passwordConfirm) {
    SignupErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  }
  return SignupErrors;
};


export { validateLogin, validateSignup };