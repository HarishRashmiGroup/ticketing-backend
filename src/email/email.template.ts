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

export const otpTemplate = (otp: number) =>{
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