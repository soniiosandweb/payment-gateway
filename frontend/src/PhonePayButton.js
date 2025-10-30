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
        <div style={{ marginTop: "40px", textAlign: "center" }}>
            <button onClick={handlePay} style={{backgroundColor: "#663399", color: "white", padding: "11px 30px", cursor: "pointer", borderWidth: "1px 1px 1px 1px", borderColor: "black", borderStyle: "solid", borderRadius: "4px"}}>
                Buy with Phone Pay
            </button>
        </div>
    )
}

export default PhonePayButton