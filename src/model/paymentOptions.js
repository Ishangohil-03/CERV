import { Images } from '../CommonConfig'

export default paymentOptions = [
    {   
        pid:0,
        paymentType:'card',
        logo: Images.MASTERCARD,
        cardNumber: 1234567891234567,
        expiryDate: "07/24",
        cvv: 572,
        cardHolder: 'Toni Kroos'
    },

    {   
        pid:1,
        paymentType:'card',
        logo: Images.VISA,
        cardNumber: 1200543210456789,
        expiryDate: "10/23",
        cvv: 572,
        cardHolder: 'Toni Kroos'
    },

    {
        pid:2,
        paymentType:'other',
        type:'Apple Pay',
        logo: Images.APPLE_PAY,
        id: 'tonikroosgoat@applepay.in'
    },
    
    {
        pid: 3,
        paymentType:'other',
        type:'Google Pay',
        logo: Images.GOOGLE_PAY,
        id: 'tonikroosgoat@okicici'
    },
]
