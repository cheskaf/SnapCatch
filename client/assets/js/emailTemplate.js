// emailTemplate.js
module.exports = (name, email, data) => `
<h2>SnapCatch Customer Training Registration</h2>
<h3>Dear ${name},</h3>
<p>Welcome to SnapCatch! Thank you for registering with us!</p>
<p>Here are the details you provided:</p>
<ul>
    <li><strong>Name:</strong> ${data.FirstName} ${data.LastName}</li>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Contact Number:</strong> ${data.ContactNumber}</li>
    <li><strong>Company Name:</strong> ${data.CompanyName}</li>
</ul>

<h3>Training Details:</h3>

<h4>Meeting Link: <a href="#">link</a></h4>

<p>
    Best regards,<br/>
    <b>SnapCatch Team</b>
</p>
`;
