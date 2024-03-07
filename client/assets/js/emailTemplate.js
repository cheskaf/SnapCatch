module.exports = (name, email, data) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        ul {
            list-style-type: none;
        } 
    </style>
</head>
<body>
    <div style="text-align: left;" style="width: 100%; max-width: 600px;">
        <img src="https://i.ibb.co/g3kr7hz/header-1.png" alt="Header Image">
        <div style="text-align: left; width: 100%; max-width: 600px;">
            <h3>Dear ${name},</h3>
            <p>Welcome to SnapCatch! Thank you for registering with us!</p>
            <p>Here are the details you provided:</p>
            <ul>
                <li><strong>Name:</strong> ${data.FirstName} ${data.LastName}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Contact Number:</strong> ${data.ContactNumber}</li>
                <li><strong>Company Name:</strong> ${data.CompanyName}</li>
            </ul>
            <p>
                Best regards,<br/>
                <b>The SnapCatch Team</b>
            </p>
            <img src="https://i.ibb.co/TvWdB18/transparent-4.png" alt="SnapCatch Logo" style="width: 200px;">
        </div>
    </div>
</body>
</html>
`;
