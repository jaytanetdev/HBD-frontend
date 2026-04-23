import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup.string().required('กรุณากรอก username'),
  password: yup.string().required('กรุณากรอก password'),
});

export const registerSchema = yup.object({
  username: yup.string().required('กรุณากรอก username').min(3, 'username ต้องมีอย่างน้อย 3 ตัวอักษร'),
  password: yup.string().required('กรุณากรอก password').min(6, 'password ต้องมีอย่างน้อย 6 ตัวอักษร'),
});

export const createCardSchema = yup.object({
  recipientName: yup.string().required('กรุณากรอกชื่อคนที่จะอวยพร'),
  themeId: yup.string().required('กรุณาเลือกธีม'),
});
