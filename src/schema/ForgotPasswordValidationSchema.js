import * as yup from 'yup'

const ForgotPasswordValidationSchema = yup.object().shape({
    email: yup.string().email().required('Email is required.')
})

export default ForgotPasswordValidationSchema;