export const referralEmailHtml = (tenantName: string, referralCode: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Referral Code is Ready</title>
</head>
<body style="margin:0;padding:0;background-color:#f0fafa;font-family:'Georgia',serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fafa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#f8fbfb;padding:36px 0;text-align:center;border-bottom:1px solid #e4f0f0;">
              <span style="font-size:36px;font-weight:800;color:#13c4a3;font-family:'Georgia',serif;letter-spacing:-1px;">PlacePin</span>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:48px 48px 24px;text-align:center;">
              <div style="font-size:56px;margin-bottom:16px;">🎉</div>
              <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#0d1f1f;font-family:'Georgia',serif;line-height:1.2;">
                Landlord Referral Code
              </h1>
              <p style="margin:0;font-size:16px;color:#5a7a7a;line-height:1.6;font-family:Arial,sans-serif;">
                Hey <strong style="color:#0d1f1f;">${tenantName}</strong>, your landlord has invited you to PlacePin!<br/>
                Use the referral code below to get started.
              </p>
            </td>
          </tr>

          <!-- Referral Code Box -->
          <tr>
            <td style="padding:8px 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f0fafa;border:2px dashed #13c4a3;border-radius:12px;padding:32px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:13px;font-family:Arial,sans-serif;color:#5a7a7a;text-transform:uppercase;letter-spacing:2px;">Your Referral Code</p>
                    <p style="margin:0;font-size:36px;font-weight:900;color:#13c4a3;letter-spacing:6px;font-family:'Courier New',monospace;">
                      ${referralCode}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <hr style="border:none;border-top:1px solid #e4f0f0;margin:0;" />
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:32px 48px 48px;text-align:center;">
              <p style="margin:0 0 24px;font-size:15px;color:#5a7a7a;font-family:Arial,sans-serif;">
                Apply this referral code when signing up on PlacePin.
              </p>
              <a href="https://www.placepin.io/login"
                 style="display:inline-block;background-color:#13c4a3;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 48px;border-radius:8px;font-family:Arial,sans-serif;letter-spacing:0.5px;">
                Get Started →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fbfb;padding:24px 48px;text-align:center;border-top:1px solid #e4f0f0;">
              <p style="margin:0;font-size:12px;color:#8aacac;font-family:Arial,sans-serif;line-height:1.6;">
                You received this email because a landlord invited you to PlacePin.<br/>
                © ${new Date().getFullYear()} PlacePin. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;