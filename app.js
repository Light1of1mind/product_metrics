function readInputs() {
  return {
    // Registration
    regAttempts: +document.getElementById("regAttempts").value || 0,
    newUsers: +document.getElementById("newUsers").value || 0,
    regFields: +document.getElementById("regFields").value || 3,

    // Login
    loginAttempts: +document.getElementById("loginAttempts").value || 0,
    loginFields: +document.getElementById("loginFields").value || 3,

    // Platform
    responseTime: +document.getElementById("responseTime").value || 300,
    uptime: +document.getElementById("uptime").value || 99,
    errorRate: +document.getElementById("errorRate").value || 1,
    otpDelivery: +document.getElementById("otpDelivery").value || 10,

    // OTP cost
    smsCost: +document.getElementById("smsCost").value || 0,
    pushCost: +document.getElementById("pushCost").value || 0,
    emailCost: +document.getElementById("emailCost").value || 0,
    totpCost: +document.getElementById("totpCost").value || 0,

    // Support
    supportCalls: +document.getElementById("supportCalls").value || 0,
    supportHours: +document.getElementById("supportHours").value || 0,
    supportHourCost: +document.getElementById("supportHourCost").value || 0,
  };
}

function fmtPct(value) {
  return Number.isFinite(value) ? (value * 100).toFixed(2) + "%" : "—";
}

function fmtMoney(value) {
  return Number.isFinite(value) ? "$" + value.toFixed(2) : "—";
}

function render(result) {
  document.getElementById("kpi").innerHTML = `
    <div class="kpi-card">Reg CR: ${fmtPct(result.regCR)}</div>
    <div class="kpi-card">Login CR: ${fmtPct(result.loginCR)}</div>
    <div class="kpi-card">Page Load Prob: ${fmtPct(result.pPage)}</div>
    <div class="kpi-card">OTP Success Prob: ${fmtPct(result.pOtp)}</div>
    <div class="kpi-card">OTP Cost: ${fmtMoney(result.otpCost)}</div>
    <div class="kpi-card">Support Cost: ${fmtMoney(result.supportCost)}</div>
    <div class="kpi-card">Total Cost: ${fmtMoney(result.totalCost)}</div>
  `;

  document.getElementById("regFunnel").innerHTML = `
    Attempts: ${Math.round(result.regAttempts)}<br>
    Page: ${Math.round(result.regPage)}<br>
    Form: ${Math.round(result.regForm)}<br>
    OTP: ${Math.round(result.regOtp)}<br>
    Success: ${Math.round(result.regSuccess)}
  `;

  document.getElementById("loginFunnel").innerHTML = `
    Attempts: ${Math.round(result.loginAttempts)}<br>
    Page: ${Math.round(result.loginPage)}<br>
    Form: ${Math.round(result.loginForm)}<br>
    OTP: ${Math.round(result.loginOtp)}<br>
    Success: ${Math.round(result.loginSuccess)}
  `;
}

function recalc() {
  const inputs = readInputs();
  const result = calculate(inputs);
  render(result);
}

document.getElementById("recalc").onclick = recalc;

// initial render on page load so the UI isn't empty before the first click
recalc();
