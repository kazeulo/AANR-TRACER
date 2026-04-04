import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// types

interface SendReportBody {
  recipientEmail: string;
  submittedByName: string;
  submittedByEmail: string;
  submittedByOrg: string;
  submittedByRole: string;
  technologyName: string;
  technologyType: string;
  trlLevel: number;
  trlDescription: string;
  assessmentDate: string;
  pdfBase64: string; // base64-encoded PDF
}

// Route handler 

export async function POST(req: NextRequest) {
  try {
    const body: SendReportBody = await req.json();

    const {
      recipientEmail,
      submittedByName,
      submittedByEmail,
      submittedByOrg,
      submittedByRole,
      technologyName,
      technologyType,
      trlLevel,
      trlDescription,
      assessmentDate,
      pdfBase64,
    } = body;

    if (!recipientEmail || !pdfBase64) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Nodemailer transporter via Gmail App Password
    const transporter = nodemailer.createTransport({
      host:   "smtp.gmail.com",
      port:   465,
      secure: true,
      family: 4,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    } as nodemailer.TransportOptions);

    // Email body
    const htmlBody = `
<div style="font-family: Arial, sans-serif; font-size: 14px; color: #1a2e1e; line-height: 1.7; max-width: 600px;">
  <p>Good day,</p>

  <p>Please find attached the Technology Readiness Level (TRL) Assessment Report generated through TRACER.</p>

  <p><strong>Assessment Summary:</strong></p>
  <ul style="padding-left: 20px; margin: 4px 0;">
    <li><strong>Technology Name:</strong> ${technologyName}</li>
    <li><strong>Technology Type:</strong> ${technologyType}</li>
    <li><strong>TRL Level:</strong> ${trlLevel}</li>
    <li><strong>TRL Description:</strong> ${trlDescription}</li>
    <li><strong>Assessment Date:</strong> ${assessmentDate}</li>
  </ul>

  <p><strong>Submitted By:</strong></p>
  <ul style="padding-left: 20px; margin: 4px 0;">
    <li><strong>Name:</strong> ${submittedByName || "—"}</li>
    <li><strong>Email:</strong> ${submittedByEmail || "—"}</li>
    <li><strong>Organization:</strong> ${submittedByOrg || "—"}</li>
    <li><strong>Role:</strong> ${submittedByRole || "—"}</li>
  </ul>

  <p>The complete assessment report is attached as a PDF.</p>

  <p>For questions, contact: <a href="mailto:${submittedByEmail}">${submittedByEmail}</a></p>

  <p>Best regards,<br/><strong>TRACER Team</strong></p>
</div>`;

    const textBody = `Good day,

Please find attached the Technology Readiness Level (TRL) Assessment Report generated through TRACER.

Assessment Summary:
* Technology Name: ${technologyName}
* Technology Type: ${technologyType}
* TRL Level: ${trlLevel}
* TRL Description: ${trlDescription}
* Assessment Date: ${assessmentDate}

Submitted By:
* Name: ${submittedByName || "—"}
* Email: ${submittedByEmail || "—"}
* Organization: ${submittedByOrg || "—"}
* Role: ${submittedByRole || "—"}

The complete assessment report is attached as a PDF.

For questions, contact: ${submittedByEmail}

Best regards,
TRACER Team`;

    //  Send      
    await transporter.sendMail({
      from: `"TRACER Team" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `TRACER Assessment Report — ${technologyName} (TRACER Level ${trlLevel})`,
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: `TRACER_Report_${technologyName.replace(/\s+/g, "_")}.pdf`,
          content:  Buffer.from(pdfBase64, "base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-report]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email." },
      { status: 500 }
    );
  }
}