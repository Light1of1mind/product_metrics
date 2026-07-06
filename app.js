function readInputs() {
  return {
    // Регистрация
    regAttempts: +document.getElementById("regAttempts").value || 0,
    newUsers: +document.getElementById("newUsers").value || 0,
    regFields: +document.getElementById("regFields").value || 3,

    // Вход
    loginAttempts: +document.getElementById("loginAttempts").value || 0,
    loginFields: +document.getElementById("loginFields").value || 3,

    // Платформа
    responseTime: +document.getElementById("responseTime").value || 300,
    uptime: +document.getElementById("uptime").value || 99,
    errorRate: +document.getElementById("errorRate").value || 1,
    otpDelivery: +document.getElementById("otpDelivery").value || 10,

    // Стоимость OTP
    smsCost: +document.getElementById("smsCost").value || 0,
    pushCost: +document.getElementById("pushCost").value || 0,
    emailCost: +document.getElementById("emailCost").value || 0,
    totpCost: +document.getElementById("totpCost").value || 0,

    // Поддержка
    supportCalls: +document.getElementById("supportCalls").value || 0,
    supportHours: +document.getElementById("supportHours").value || 0,
    supportHourCost: +document.getElementById("supportHourCost").value || 0,
  };
}

function fmtPct(value) {
  return Number.isFinite(value) ? (value * 100).toFixed(2) + "%" : "—";
}

function fmtMoney(value) {
  return Number.isFinite(value) ? value.toFixed(2) + " ₽" : "—";
}

function render(result) {
  document.getElementById("kpi").innerHTML = `
    <div class="kpi-card">Конверсия регистрации: ${fmtPct(result.regCR)}</div>
    <div class="kpi-card">Конверсия входа: ${fmtPct(result.loginCR)}</div>
    <div class="kpi-card">Вероятность загрузки страницы: ${fmtPct(result.pPage)}</div>
    <div class="kpi-card">Успешность доставки OTP: ${fmtPct(result.pOtp)}</div>
    <div class="kpi-card">Стоимость OTP: ${fmtMoney(result.otpCost)}</div>
    <div class="kpi-card">Стоимость поддержки: ${fmtMoney(result.supportCost)}</div>
    <div class="kpi-card">Общие затраты: ${fmtMoney(result.totalCost)}</div>
  `;

  document.getElementById("regFunnel").innerHTML = `
    Попытки: ${Math.round(result.regAttempts)}<br>
    Открыли страницу: ${Math.round(result.regPage)}<br>
    Заполнили форму: ${Math.round(result.regForm)}<br>
    Прошли OTP: ${Math.round(result.regOtp)}<br>
    Успешно зарегистрированы: ${Math.round(result.regSuccess)}
  `;

  document.getElementById("loginFunnel").innerHTML = `
    Попытки: ${Math.round(result.loginAttempts)}<br>
    Открыли страницу: ${Math.round(result.loginPage)}<br>
    Заполнили форму: ${Math.round(result.loginForm)}<br>
    Прошли OTP: ${Math.round(result.loginOtp)}<br>
    Успешный вход: ${Math.round(result.loginSuccess)}
  `;
}

function recalc() {
  const inputs = readInputs();
  const result = calculate(inputs);
  render(result);
}

document.getElementById("recalc").onclick = recalc;

// первый расчёт сразу при загрузке страницы, чтобы UI не был пустым
recalc();
