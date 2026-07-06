function calculate(inputs) {

  // -------- PAGE LOAD PROB --------
  const pPage =
    getProb("responseTime", inputs.responseTime) *
    (inputs.uptime / 100) *
    (1 - inputs.errorRate / 100);

  // -------- UX PROB --------
  const pFieldsReg = getProb("fields", inputs.regFields);
  const pFieldsLogin = getProb("fields", inputs.loginFields);

  // -------- OTP PROB --------
  const pOtp = getProb("otpDelivery", inputs.otpDelivery);

  // =========================
  // REGISTRATION FUNNEL
  // =========================

  const regAttempts = inputs.regAttempts;

  const regPage = regAttempts * pPage;
  const regForm = regPage * pFieldsReg;
  const regOtp = regForm * pOtp;
  const regSuccess = regOtp;

  // =========================
  // LOGIN FUNNEL
  // =========================

  const loginAttempts = inputs.loginAttempts;

  const loginPage = loginAttempts * pPage;

  // доля входов через биометрию (fingerprint/FaceID) не требует OTP вообще.
  // Успех такого входа зависит только от стабильности соединения (уже учтено
  // в pPage выше) — отдельной вероятности биометрии не требуется.
  const bioShare = Math.min(inputs.appShare, 100) / 100;

  const loginBioUsers = loginPage * bioShare;
  const loginStdUsers = loginPage * (1 - bioShare);

  const loginBioSuccess = loginBioUsers;

  const loginForm = loginStdUsers * pFieldsLogin;
  const loginOtp = loginForm * pOtp;

  const loginSuccess = loginOtp + loginBioSuccess;

  // =========================
  // OTP COST MODEL
  // =========================

  const otpCountReg = regForm * 1.05; // retry factor
  const otpCountLogin = loginForm * 1.03; // только стандартный вход, биометрия не шлёт OTP

  const shareSum =
    inputs.smsShare + inputs.pushShare + inputs.emailShare + inputs.totpShare || 1;

  const avgOtpCost =
    inputs.smsCost * (inputs.smsShare / shareSum) +
    inputs.pushCost * (inputs.pushShare / shareSum) +
    inputs.emailCost * (inputs.emailShare / shareSum) +
    inputs.totpCost * (inputs.totpShare / shareSum);

  const otpCost =
    (otpCountReg + otpCountLogin) * avgOtpCost;

  // Экономия по сравнению с базовым сценарием: 100% SMS и без биометрии
  const loginFormBaseline = loginPage * pFieldsLogin;
  const otpCountLoginBaseline = loginFormBaseline * 1.03;
  const otpCostBaseline = (otpCountReg + otpCountLoginBaseline) * inputs.smsCost;
  const otpSavings = otpCostBaseline - otpCost;

  // =========================
  // SUPPORT COST
  // =========================

  const supportCost =
    inputs.supportCalls *
    inputs.supportHours *
    inputs.supportHourCost;

  // =========================
  // KPI
  // =========================

  return {
    // funnel
    regAttempts,
    regPage,
    regForm,
    regOtp,
    regSuccess,

    loginAttempts,
    loginPage,
    loginBioUsers,
    loginBioSuccess,
    loginForm,
    loginOtp,
    loginSuccess,

    // CR
    regCR: regSuccess / regAttempts,
    loginCR: loginSuccess / loginAttempts,

    // cost
    otpCost,
    otpCostBaseline,
    otpSavings,
    supportCost,
    totalCost: otpCost + supportCost,

    // probabilities
    pPage,
    pFieldsReg,
    pFieldsLogin,
    pOtp
  };
}