document.getElementById("recalc").onclick = () => {

  const inputs = {
    regAttempts: +document.getElementById("regAttempts").value || 0,
    newUsers: +document.getElementById("newUsers").value || 0,
    regFields: +document.getElementById("regFields").value || 3,

    loginAttempts: +document.getElementById("loginAttempts").value || 0,
    loginFields: +document.getElementById("loginFields").value || 3,

    responseTime: +document.getElementById("responseTime").value || 300,
    uptime: +document.getElementById("uptime").value || 99,
    errorRate: +document.getElementById("errorRate").value || 1,
    otpDelivery: +document.getElementById("otpDelivery").value || 10,
  };

document.getElementById("kpi").innerHTML = `
  <div class="kpi-card">Reg CR: ${(result.regCR*100).toFixed(2)}%</div>
  <div class="kpi-card">Login CR: ${(result.loginCR*100).toFixed(2)}%</div>

  <div class="kpi-card">OTP Cost: $${result.otpCost.toFixed(2)}</div>
  <div class="kpi-card">Support Cost: $${result.supportCost.toFixed(2)}</div>
  <div class="kpi-card">Total Cost: $${result.totalCost.toFixed(2)}</div>

  <div class="kpi-card">Page Load Prob: ${(result.pPage*100).toFixed(2)}%</div>
`;
  const result = calculate(inputs);

  document.getElementById("kpi").innerHTML = `
    <div class="kpi-card">Reg CR: ${(result.regCR*100).toFixed(2)}%</div>
    <div class="kpi-card">Login CR: ${(result.loginCR*100).toFixed(2)}%</div>
    <div class="kpi-card">Page Prob: ${(result.pPage*100).toFixed(2)}%</div>
  `;

 document.getElementById("regFunnel").innerHTML = `
Registration Funnel<br><br>
Attempts: ${Math.round(result.regAttempts)}<br>
Page: ${Math.round(result.regPage)}<br>
Form: ${Math.round(result.regForm)}<br>
OTP: ${Math.round(result.regOtp)}<br>
Success: ${Math.round(result.regSuccess)}
`;

document.getElementById("loginFunnel").innerHTML = `
Login Funnel<br><br>
Attempts: ${Math.round(result.loginAttempts)}<br>
Page: ${Math.round(result.loginPage)}<br>
Form: ${Math.round(result.loginForm)}<br>
OTP: ${Math.round(result.loginOtp)}<br>
Success: ${Math.round(result.loginSuccess)}
`;