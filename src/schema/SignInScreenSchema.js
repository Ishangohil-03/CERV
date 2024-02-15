import * as yup from 'yup';

const SignInScreenValidationSchema = yup.object().shape({
    email: yup.string().email().required('Email is required.'),
    password: yup.string().min(6,"Password must have atleast 6 characters").required("Password cannot be empty."),
})

export default SignInScreenValidationSchema;