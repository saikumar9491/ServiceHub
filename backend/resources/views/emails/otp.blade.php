<!DOCTYPE html>
<html>
<head>
    <title>Password Reset OTP</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
    <div style="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg shadow-indigo-100 text-center">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="color: #64748b; font-size: 16px; margin-bottom: 30px;">
            We received a request to reset your password. Here is your One Time Password (OTP):
        </p>
        <div style="background-color: #eef2ff; padding: 15px; border-radius: 10px; display: inline-block; margin-bottom: 30px;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4338ca;">
                {{ $otp }}
            </span>
        </div>
        <p style="color: #64748b; font-size: 14px;">
            This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.
        </p>
    </div>
</body>
</html>
