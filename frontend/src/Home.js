import { useState } from 'react';
import GooglePayButtonComponent from './GooglePayButtonComponent';
import RazorpayButton from './RazorPayButton';
import PhonePayButton from './PhonePayButton';

const Home = () => {
    const [amount, setAmount] = useState(500);

    return (
        <>
            <div style={{ marginTop: "40px", textAlign: "center" }}>
                <label>Amount: </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    style={{ padding: "10px" }}
                    name='amount'
                />
            </div>
            <GooglePayButtonComponent amount={parseFloat(amount)} />

            <RazorpayButton amount={parseFloat(amount)} />

            <PhonePayButton amount={parseFloat(amount)} />
        </>
    );
}

export default Home