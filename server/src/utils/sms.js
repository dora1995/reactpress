import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.163.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "19147776843@163.com",
    pass: process.env.EMAIL_AUTH_CODE, // 从环境变量中读取授权码
  },
});

const name = '跨境鱼友圈'
async function sendEmailCode(email, code) {
  const mailOptions = {
    from: "19147776843@163.com",
    to: email,
    subject: `${name} 验证码`,
    text: `【${name}】您好！欢迎使用${name}，您的验证码是：${code}，5分钟内有效`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("邮件发送成功", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("邮件发送失败：", error);
    throw new Error(`邮件发送失败: ${error.message}`);
  }
}

export { sendCode, sendEmailCode };
