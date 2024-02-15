import * as yup from 'yup'

const CreditCardValidationSchema = yup.object().shape({
    cardNumber: yup.number()
    .positive("Card Number cannot be negative!")
    .integer("Card Number cannot have decimals or hyphens")
    .moreThan(999999999999999, "The card number must be 16 digits long")
    .required("Card Number is required!"),

    expiryDate: yup.string()
    .required("Expiry Date is required."),

    cvv: yup.number()
    .positive('CVV cannot be negative!')
    .integer("CVV cannot contain decimals.")
    .lessThan(1000,"CVV must be 3 digit long")
    .required("CVV is required."),

    name: yup.string()
    .required("Name is required.")
})

export default CreditCardValidationSchema;