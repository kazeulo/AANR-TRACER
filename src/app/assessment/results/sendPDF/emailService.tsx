import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
export async function sendPdfEmail(data) {
  try {
    // Get Gmail App Password from .env file
    const gmailAppPassword = 

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kzlyrshairam@gmail.com",
        pass: gmailAppPassword
      }
    });

    const filename = `TRL_Assessment_${data.technologyName.replace(/[^a-z0-9]/gi, '_')}.pdf`;

    const info = await transporter.sendMail({
      from: `"TRACER Team" <kzlyrshairam@gmail.com>`,
      to: data.recipientEmail,
      subject: `TRL Assessment Report - ${data.technologyName}`,
      html: `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #30b232; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .summary ul { list-style: none; padding: 0; }
            .summary li { padding: 5px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>TRL Assessment Report</h2>
          </div>
          
          <div class="content">
            <p>Good day,</p>
            
            <p>Please find attached the Technology Readiness Level (TRL) Assessment Report generated through TRACER.</p>
            
            <div class="summary">
              <h3 style="margin-top: 0;">Assessment Summary:</h3>
              <ul>
                <li><strong>Technology Name:</strong> ${data.technologyName}</li>
                <li><strong>Technology Type:</strong> ${data.technologyType}</li>
                <li><strong>TRL Level:</strong> ${data.highestCompletedTRL}</li>
                <li><strong>TRL Description:</strong> ${data.trlLabel}</li>
                <li><strong>Assessment Date:</strong> ${data.assessmentDate}</li>
              </ul>
              
              <h4>Submitted By:</h4>
              <ul>
                <li><strong>Name:</strong> ${data.userName}</li>
                <li><strong>Email:</strong> ${data.userEmail}</li>
                <li><strong>Organization:</strong> ${data.userOrgCom}</li>
                <li><strong>Role:</strong> ${data.userRole}</li>
              </ul>
            </div>
            
            <p>The complete assessment report is attached as a PDF.</p>
            
            <p>For questions, contact: <a href="mailto:${data.userEmail}">${data.userEmail}</a></p>
            
            <p>Best regards,<br>
            <strong>TRACER Team</strong><br>
            DOST-PCAARRD</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from TRACER.</p>
            <p>© ${new Date().getFullYear()} DOST-PCAARRD.</p>
          </div>
        </body>
      </html>`,
      attachments: [
        {
          filename,
          content: data.pdfBase64,
          encoding: "base64"
        }
      ]
    });

    console.log("Email sent:", info.messageId);
    return { success: true, id: info.messageId };

  } catch (error) {
    console.error("Gmail send error:", error);
    return { success: false, error: error.message };
  }
}
