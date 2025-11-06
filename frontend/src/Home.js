import { useState } from 'react';
import GooglePayButtonComponent from './GooglePayButtonComponent';
import RazorpayButton from './RazorPayButton';
import PhonePayButton from './PhonePayButton';

const Home = () => {
    const [amount, setAmount] = useState(500);
    const [firstName, setFirstName] = useState('Test');
    const [lastName, setLastName] = useState('User');
    const [email, setEmail] = useState('test@yopmail.com');

    return (
        <>
            <div className='form_section'>
                <div className='form_row'>
                    <div className='form_col'>
                        <label htmlFor='firstname'>First Name:</label>
                        <input type='text' className='form-control' name='firstname' id='firstname' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className='form_col'>
                        <label htmlFor='lastname'>Last Name:</label>
                        <input type='text' className='form-control' name='lastname' id='lastname' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className='form_col'>
                        <label htmlFor='emailaddress'>Email:</label>
                        <input type='email' className='form-control' name='emailaddress' id='emailaddress' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='form_col'>
                        <label htmlFor='amount'>Amount:</label>
                        <input type='number' className='form-control' name='amount' id='amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div className='form_col payment_buttons'>
                        <p>Payment Method:</p>
                        <GooglePayButtonComponent amount={parseFloat(amount)} />

                        <RazorpayButton amount={parseFloat(amount)} />

                        <PhonePayButton amount={parseFloat(amount)} />
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default Home