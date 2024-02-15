import * as yup from 'yup';
import { ref } from 'yup';

const SignUpValidationSchema = yup.object().shape({
    username: yup.string().required('Username is required.') ,
    email: yup.string().email().required('Email is required.'),
    password: yup.string().min(6,"Password must have atleast 6 characters.").required("Password cannot be empty."),
    confirmPassword: yup.string().required('Please confirm your password.').oneOf([ref("password")],"Passwords do not match.")
})

export default SignUpValidationSchema;