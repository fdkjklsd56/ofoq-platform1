import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string,
  code: string,
  name: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'أفق <onboarding@resend.dev>', // مؤقتاً باستخدام resend.dev
      to: email,
      subject: 'رمز التحقق - منصة أفق',
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Tajawal', sans-serif; background: #0a0a0a; color: #f0f0f0; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #ffffff; }
            .code-box { 
              background: rgba(255,255,255,0.05); 
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 16px; 
              padding: 30px; 
              text-align: center;
              margin: 20px 0;
            }
            .code { 
              font-size: 48px; 
              letter-spacing: 10px; 
              color: #ffffff;
              font-weight: bold;
            }
            .sub { color: rgba(255,255,255,0.5); font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; color: rgba(255,255,255,0.2); font-size: 12px; }
            .divider { border: none; border-top: 1px solid rgba(255,255,255,0.05); margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎓 أفق</div>
            </div>
            
            <h2 style="color: #ffffff;">مرحباً ${name} 👋</h2>
            <p style="color: rgba(255,255,255,0.6); font-size: 18px;">
              أدخل الرمز التالي للتحقق من بريدك الإلكتروني:
            </p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <p class="sub">⏳ هذا الرمز صالح لمدة 15 دقيقة</p>
            <p class="sub">إذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة</p>
            
            <hr class="divider">
            
            <div class="footer">
              منصة أفق للتعليم<br>
              © 2026 جميع الحقوق محفوظة
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}