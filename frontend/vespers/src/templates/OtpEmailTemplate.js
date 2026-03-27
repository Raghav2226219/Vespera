export const OtpEmailHtml = `
  <div style="font-family: 'Inter', 'Segoe UI', sans-serif; background: linear-gradient(135deg, #0b1914, #132d1f, #193a29); padding: 50px 20px; color: #fefce8; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: rgba(17, 30, 24, 0.8); border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 24px; box-shadow: 0 10px 40px rgba(163, 230, 53, 0.1); overflow: hidden;">
      
      <div style="background: rgba(255, 255, 255, 0.03); padding: 35px 30px; border-bottom: 1px solid rgba(250, 204, 21, 0.1);">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;
                   background: linear-gradient(to right, #facc15, #a3e635, #4ade80);
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                   text-shadow: 0 0 20px rgba(250, 204, 21, 0.3);">
          Verify Your Identity 🛡️
        </h1>
      </div>

      <div style="padding: 40px 30px;">
        <p style="font-size: 16px; color: #bbf7d0; line-height: 1.6; margin-bottom: 30px;">
          You requested an email verification for your <strong style="color: #facc15;">Vespera</strong> account. Enter the secure verification code below to authenticate your profile.
        </p>

        <div style="margin: 35px auto; max-width: 250px; background: rgba(2, 6, 23, 0.6); border: 1px solid rgba(163, 230, 53, 0.4); padding: 20px; border-radius: 16px; box-shadow: inset 0 0 20px rgba(163, 230, 53, 0.1), 0 0 20px rgba(250, 204, 21, 0.15);">
          <div style="font-family: monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px;
                      background: linear-gradient(to right, #facc15, #a3e635);
                      -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            {{OTP_CODE}}
          </div>
        </div>

        <p style="font-size: 13px; color: #86efac; font-style: italic;">This code securely expires in 5 minutes.</p>
      </div>

      <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(250, 204, 21, 0.2), transparent);"></div>

      <div style="padding: 24px; font-size: 12px; color: #64748b; background: rgba(2, 6, 23, 0.5);">
        <p style="margin: 0;">If you didn't request this verification, protect your account and ignore this email.</p>
        <p style="margin-top: 10px;">© 2025 Vespera — Built to Create, Together.</p>
      </div>
    </div>
  </div>
`;
