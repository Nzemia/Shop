import axios from "axios";
import moment from "moment";

const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_PASSKEY,
  MPESA_SHORTCODE,
  MPESA_ENV
} = process.env;

const BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// TODO:: Implemenent this

export const getAccessToken = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        auth: {
          username: MPESA_CONSUMER_KEY!,
          password: MPESA_CONSUMER_SECRET!
        }
      }
    );
    return res.data.access_token;
  } catch (error: any) {
    console.error("M-Pesa Access Token Error:", error.response?.data || error.message);
    throw new Error("Failed to get M-Pesa access token");
  }
};

export const stkPush = async ({
  phone,
  amount,
  orderId
}: {
  phone: string;
  amount: number;
  orderId: string;
}) => {
  try {
    const token = await getAccessToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const formattedPhone = formatPhoneNumber(phone);

    const res = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount), 
        PartyA: formattedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL || `${process.env.API_BASE_URL}/api/payments/mpesa-callback`,
        AccountReference: orderId,
        TransactionDesc: "JengaShop Order Payment"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (error: any) {
    console.error("M-Pesa STK Push Error:", error.response?.data || error.message);
    throw new Error("Failed to initiate M-Pesa payment");
  }
};

export const stkQuery = async (checkoutRequestId: string) => {
  try {
    const token = await getAccessToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const res = await axios.post(
      `${BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (error: any) {
    console.error("M-Pesa STK Query Error:", error.response?.data || error.message);
    throw new Error("Failed to query M-Pesa payment status");
  }
};

// Helper function to format phone number
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Handle Kenyan phone numbers
  if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    return cleaned;
  } else if (cleaned.length === 9) {
    return '254' + cleaned;
  }

  return cleaned;
};

export { formatPhoneNumber };
