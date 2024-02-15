import * as yup from 'yup'

const OtherPaymentTypeValidationSchema = yup.object().shape({
    id: yup.string().email().required('ID is required.'),
    type: yup.string().required('Type of payment is required.')
})

export default OtherPaymentTypeValidationSchema;