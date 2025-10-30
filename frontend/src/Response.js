import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Response = () => {
    const {id} = useParams();

    useEffect(() => {

        const getResponse = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/phonepay-status/${id}`);
                if (res.data) {
                    console.log(res)
                    alert("✅ Payment Successful!");
                    window.location.href = "/";
                } else {
                    console.error('Invalid payment initiation response', res.data);
                    alert('Payment Status', res.data.error);
                    window.location.href = "/";
                }
            } catch (err) {
                console.error('Payment initiation failed', err);
                alert('Payment failed '+ err?.response?.data?.error);
                window.location.href = "/";
            }
        }
        if(id) {
            getResponse();
        }
        
    },[id])

}

export default Response