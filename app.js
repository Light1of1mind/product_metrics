function readInputs() {
  return {
    // Регистрация
    regAttempts: +document.getElementById("regAttempts").value || 0,
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

    // Доли типов OTP
    smsShare: +document.getElementById("smsShare").value || 70,
    pushShare: +document.getElementById("pushShare").value || 15,
    emailShare: +document.getElementById("emailShare").value || 10,
    totpShare: +document.getElementById("totpShare").value || 5,

    // Мобильное приложение (биометрия)
    appShare: +document.getElementById("appShare").value || 0,

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
    <div class="kpi-card">Экономия на OTP (mix + биометрия): ${fmtMoney(result.otpSavings)}</div>
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
    Вход по биометрии (без OTP): ${Math.round(result.loginBioUsers)}<br>
    Стандартный вход — заполнили форму: ${Math.round(result.loginForm)}<br>
    Прошли OTP: ${Math.round(result.loginOtp)}<br>
    Успешно через биометрию: ${Math.round(result.loginBioSuccess)}<br>
    Успешный вход (всего): ${Math.round(result.loginSuccess)}
  `;
}

const FIELD_IDS = [
  "regAttempts", "regFields",
  "loginAttempts", "loginFields",
  "responseTime", "uptime", "errorRate", "otpDelivery",
  "smsCost", "pushCost", "emailCost", "totpCost",
  "smsShare", "pushShare", "emailShare", "totpShare",
  "appShare",
  "supportCalls", "supportHours", "supportHourCost",
];

const STORAGE_KEY = "ciamSimulatorInputs";

// Ссылка с параметрами в URL имеет приоритет над сохранённым состоянием —
// так шаренная ссылка всегда открывается с переданными в ней значениями.
function loadState() {
  const params = new URLSearchParams(location.search);
  const hasParams = FIELD_IDS.some((id) => params.has(id));

  let values = {};
  if (hasParams) {
    FIELD_IDS.forEach((id) => {
      if (params.has(id)) values[id] = params.get(id);
    });
  } else {
    try {
      values = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      values = {};
    }
  }

  FIELD_IDS.forEach((id) => {
    if (values[id] !== undefined) {
      document.getElementById(id).value = values[id];
    }
  });
}

function saveState() {
  const values = {};
  const params = new URLSearchParams();
  FIELD_IDS.forEach((id) => {
    const value = document.getElementById(id).value;
    values[id] = value;
    if (value !== "") params.set(id, value);
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
}

function recalc() {
  const inputs = readInputs();
  const result = calculate(inputs);
  render(result);
  saveState();
}

document.getElementById("recalc").onclick = recalc;

const responseTimeInput = document.getElementById("responseTime");
const responseTimeValue = document.getElementById("responseTimeValue");
responseTimeInput.addEventListener("input", () => {
  responseTimeValue.textContent = responseTimeInput.value;
  recalc();
});

document.getElementById("shareLink").onclick = async (event) => {
  saveState();
  await navigator.clipboard.writeText(location.href);
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = "Скопировано!";
  setTimeout(() => { button.textContent = originalText; }, 1500);
};

// восстанавливаем сохранённые или переданные в ссылке значения, затем
// сразу считаем, чтобы UI не был пустым
loadState();
responseTimeValue.textContent = responseTimeInput.value;
recalc();
