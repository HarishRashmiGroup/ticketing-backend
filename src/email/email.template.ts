import { Ticketing } from "src/ticketing/entities/ticketing.entity";

export const commentMailTemplate = (description: string, commenterName: string, taskDescription: string) => {
    const template = `
      <!DOCTYPE html>
      <html>
      <body style="
          margin: 0;
          padding: 0;
          background-color: #f5f6f8;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
      ">
          <div style="
              max-width: 600px;
              margin: 40px auto;
              background: white;
              padding: 32px;
              border-radius: 12px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          ">
              <div style="margin-bottom: 24px;">
                  <h2 style="
                      color: #1f2937;
                      margin: 0 0 8px 0;
                      font-size: 20px;
                      font-weight: 600;
                  ">New Comment on Task</h2>
                  <div style="height: 2px; background: #e5e7eb; width: 50px;"></div>
              </div>

              <div style="
                  background: #f9fafb;
                  padding: 16px;
                  border-radius: 8px;
                  margin-bottom: 24px;
              ">
                  <h3 style="
                      color: #4b5563;
                      margin: 0 0 8px 0;
                      font-size: 16px;
                      font-weight: 500;
                  ">Task Details</h3>
                  <p style="
                      color: #1f2937;
                      margin: 0;
                      font-size: 15px;
                  ">${taskDescription}</p>
              </div>

              <div style="margin-bottom: 24px;">
                  <h3 style="
                      color: #4b5563;
                      margin: 0 0 8px 0;
                      font-size: 16px;
                      font-weight: 500;
                  ">Comment from ${commenterName}</h3>
                  <p style="
                      color: #1f2937;
                      margin: 0;
                      font-size: 15px;
                  ">${description}</p>
              </div>
          </div>
      </body>
      </html>
    `;

    return template;
}

export const ticketTemplate = (ticket: Ticketing) => {
    const ticketStatus = ticket.resolvedAt ? 'resolved' : 'new';
    const ticketStatusDisplay = ticket.resolvedAt ? 'Resolved' : ' New';
    const response = ticket.resolvedAt ? 'We’re happy to inform you that your support ticket has been resolved. Please review the resolution details below.' :
        'Your support ticket has been successfully created. Our team will get back to you shortly.';
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Support Ticket Update</title>
        <style>
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #2c3e50;
                max-width: 650px;
                margin: 0 auto;
                background-color: #f5f7fa;
            }
            .main-container {
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                margin: 20px 0;
            }
            .header-bar {
                height: 8px;
                background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
            }
            .content {
                padding: 30px;
            }
            .logo-section {
                text-align: left;
                margin-bottom: 25px;
                border-bottom: 1px solid #eaeaea;
                padding-bottom: 20px;
            }
            .ticket-card {
                background-color: #f8fafc;
                border-radius: 6px;
                border-left: 4px solid #3498db;
                padding: 20px;
                margin: 25px 0;
            }
            .ticket-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            .ticket-id {
                background-color: #ebf5fb;
                color: #3498db;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: bold;
            }
            .ticket-status {
                position: absolute;
                top: -15px;
                right: -15px;
                padding: 5px 5px;
                border-radius: 5px;
                font-size: 10px;
                font-weight: 400;
                text-transform: uppercase;
            }
            .status-new {
                background-color: #e1f5fe;
                color: #0288d1;
            }
            .status-resolved {
                background-color: #e8f5e9;
                color: #2e7d32;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
            }
            .info-item {
                padding: 12px;
                background-color: #ffffff;
                border-radius: 6px;
                border: 1px solid #e0e0e0;
                margin-bottom: 5px;
            }
            .info-label {
                font-size: 12px;
                text-transform: uppercase;
                color: #7f8c8d;
                margin-bottom: 5px;
            }
            .info-value {
                font-weight: 500;
            }
            .button-row {
                margin: 25px 0;
                display: flex;
                gap: 10px;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 500;
                text-align: center;
            }
            .primary-button {
                background-color: #3498db;
                color: white;
                border: 1px solid #2980b9;
            }
            .secondary-button {
                background-color: #ffffff;
                color: #3498db;
                border: 1px solid #3498db;
            }
            .timeline {
                margin: 30px 0;
                padding-left: 20px;
                border-left: 2px solid #e0e0e0;
            }
            .timeline-item {
                position: relative;
                padding-bottom: 20px;
            }
            .timeline-item:before {
                content: "";
                position: absolute;
                left: -26px;
                top: 0;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #3498db;
            }
            .timeline-date {
                font-size: 12px;
                color: #7f8c8d;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eaeaea;
                color: #95a5a6;
                font-size: 13px;
            }
        </style>
    </head>
    <body>
        <div class="main-container">
            <div class="header-bar"></div>
            <div class="content">
                <div class="logo-section">
                    <h2 style="margin:0; color:#3498db;">Rashmi IT Support</h2>
                </div>
                
                <p>Hello ${ticket.createdBy.name},</p>
                
                <p>${response}</p>
                
                <div class="ticket-card">
                    <div class="ticket-header">
                        <div class="ticket-id">Ticket #${ticket.serialNo}</div>
                        <div class="ticket-status status-${ticketStatus}">${ticketStatusDisplay}</div>
                    </div>
                    
                    <h3 style="margin-top:0;">${ticket.item.name}</h3>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Created</div>
                            <div class="info-value">${new Date(ticket.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Last Updated</div>
                            <div class="info-value">${new Date(ticket.updatedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Department</div>
                            <div class="info-value">${ticket.createdBy.department}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Priority</div>
                            <div class="info-value">${ticket.priority}</div>
                        </div>
                    </div>
                    
                    <p>${ticket.query}</p>
                </div>
                
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-date">${new Date(ticket.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })}</div>
                        <p><strong>Ticket Created</strong></p>
                        <p>Your support request has been received and assigned to our team.</p>
                    </div>
                    ${ticket.resolvedAt ? `
                        <div class="timeline-item">
                        <div class="timeline-date">${new Date(ticket.resolvedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
            }</div>
                        <p><strong>Ticket Resolved</strong></p>
                        <p>${ticket.itReview}</p>
                    </div>
                        `: ''}
                </div>                
                <p>Best regards,<br>Rashmi IT Support Team</p>
                
                <div class="footer">
                    <p>This is an automated message from our support system. Please do not reply directly to this email.</p>
                    </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

export const otpTemplate = (otp: number) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <style>
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
              line-height: 1.6;
          }
          .otp-box {
              background-color: #f4f4f4;
              padding: 20px;
              text-align: center;
              border-radius: 5px;
              margin: 20px 0;
          }
          .otp-code {
              font-size: 32px;
              letter-spacing: 5px;
              color: #333;
              font-weight: bold;
          }
          .footer {
              font-size: 12px;
              color: #666;
              text-align: center;
              margin-top: 30px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="otp-box">
              <div class="otp-code">${otp}</div>
          </div>
          <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
          </div>
      </div>
  </body>
  </html>
  `;
}