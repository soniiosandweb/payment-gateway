import axios from "axios";

const PhonePayButton = ({ amount }) => {

    const handlePay = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/phonepay-initiate`, {
                amount,
                mobileNumber: "9999999999",
                name: "test",
                merchantUserId: 'USER'+Date.now()
            });
            if (res.data && res.data.redirectUrl) {
                // redirect to PhonePe payment page
                window.location.href = res.data.redirectUrl;
            } else {
                console.error('Invalid payment initiation response', res.data);
                alert('Invalid payment initiation response', res.data.message);
            }
        } catch (err) {
            console.error('Payment initiation failed', err);
            alert('Payment initiation failed', err);
        }
    };

    return(
        <button onClick={handlePay} className="button" style={{backgroundColor: "#663399", color: "white", borderColor: "black"}}>
            Buy with Phone Pay
        </button>
    )
}

export default PhonePayButton