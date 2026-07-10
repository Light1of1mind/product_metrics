function readInputs() {
  return {
    // Период
    periodMultiplier: +document.getElementById("period").value || 1,

    // Регистрация
    regAttempts: +document.getElementById("regAttempts").value || 2000,
    regFields: +document.getElementById("regFields").value || 3,

    // Вход
    loginAttempts: +document.getElementById("loginAttempts").value || 15000,
    loginFields: +document.getElementById("loginFields").value || 2,

    // Платформа
    responseTime: +document.getElementById("responseTime").value || 300,
    uptime: +document.getElementById("uptime").value || 98,
    errorRate: +document.getElementById("errorRate").value || 5,
    otpDelivery: +document.getElementById("otpDelivery").value || 10,

    // Стоимость OTP
    smsCost: +document.getElementById("smsCost").value || 8,
    pushCost: +document.getElementById("pushCost").value || 1,
    emailCost: +document.getElementById("emailCost").value || 0,
    totpCost: +document.getElementById("totpCost").value || 0,

    // Доли типов OTP
    smsShare: +document.getElementById("smsShare").value || 80,
    pushShare: +document.getElementById("pushShare").value || 10,
    emailShare: +document.getElementById("emailShare").value || 10,
    totpShare: +document.getElementById("totpShare").value || 0,

    // Мобильное приложение (биометрия)
    appShare: +document.getElementById("appShare").value || 80,

    // Поддержка
    baseSupportRate: +document.getElementById("baseSupportRate").value || 1,
    supportHours: +document.getElementById("supportHours").value || 0.3,
    supportHourCost: +document.getElementById("supportHourCost").value || 1500,

    // Доход
    revenuePerUser: +document.getElementById("revenuePerUser").value || 100,
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
    <div class="kpi-card">Обращения в поддержку: ${Math.round(result.supportCalls)}</div>
    <div class="kpi-card">Стоимость поддержки: ${fmtMoney(result.supportCost)}</div>
    <div class="kpi-card">Общие затраты: ${fmtMoney(result.totalCost)}</div>
    <div class="kpi-card">Доход итого: ${fmtMoney(result.revenueTotal)}</div>
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
  "period",
  "regAttempts", "regFields",
  "loginAttempts", "loginFields",
  "responseTime", "uptime", "errorRate", "otpDelivery",
  "smsCost", "pushCost", "emailCost", "totpCost",
  "smsShare", "pushShare", "emailShare", "totpShare",
  "appShare",
  "baseSupportRate", "supportHours", "supportHourCost",
  "revenuePerUser",
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

// Доли типов OTP взаимозависимы и должны в сумме давать 100%: при изменении
// одного слайдера остальные три пропорционально сжимаются/растягиваются,
// чтобы забрать оставшийся бюджет.
const OTP_SHARE_IDS = ["smsShare", "pushShare", "emailShare", "totpShare"];

function rebalanceOtpShares(changedId) {
  const changedInput = document.getElementById(changedId);
  const changedValue = Math.min(100, Math.max(0, +changedInput.value));
  changedInput.value = changedValue;

  const others = OTP_SHARE_IDS.filter((id) => id !== changedId);
  const remaining = 100 - changedValue;
  const otherValues = others.map((id) => +document.getElementById(id).value);
  const otherSum = otherValues.reduce((a, b) => a + b, 0);

  const raw = otherSum > 0
    ? otherValues.map((v) => (v / otherSum) * remaining)
    : others.map(() => remaining / others.length);

  // округляем до целых, остаток от округления отдаём последнему полю,
  // чтобы сумма всех четырёх долей была ровно 100
  const rounded = raw.map((v) => Math.round(v));
  const roundedSum = rounded.reduce((a, b) => a + b, 0);
  rounded[rounded.length - 1] += remaining - roundedSum;

  others.forEach((id, i) => {
    const value = Math.max(0, rounded[i]);
    document.getElementById(id).value = value;
    const valueEl = document.getElementById(id + "Value");
    if (valueEl) valueEl.textContent = value;
  });

  const changedValueEl = document.getElementById(changedId + "Value");
  if (changedValueEl) changedValueEl.textContent = changedValue;
}

// большинство полей FIELD_IDS — слайдеры с парным <span id="{id}Value">
// для отображения текущего значения (кроме "period" — это <select>, у
// него значение показывает сам комбобокс). В обоих случаях пересчитываем
// на лету при изменении.
function wireSliders() {
  FIELD_IDS.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    const valueEl = document.getElementById(id + "Value");
    if (valueEl) valueEl.textContent = input.value;
    input.addEventListener("input", () => {
      if (OTP_SHARE_IDS.includes(id)) {
        rebalanceOtpShares(id);
      } else if (valueEl) {
        valueEl.textContent = input.value;
      }
      recalc();
    });
  });
}

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
wireSliders();
recalc();
