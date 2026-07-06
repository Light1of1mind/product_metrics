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
  const loginForm = loginPage * pFieldsLogin;
  const loginOtp = loginForm * pOtp;
  const loginSuccess = loginOtp;

  // =========================
  // OTP COST MODEL
  // =========================

  const otpCountReg = regForm * 1.05; // retry factor
  const otpCountLogin = loginForm * 1.03;

  const avgOtpCost =
    inputs.smsCost * 0.7 +
    inputs.pushCost * 0.15 +
    inputs.emailCost * 0.1 +
    inputs.totpCost * 0.05;

  const otpCost =
    (otpCountReg + otpCountLogin) * avgOtpCost;

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
    loginForm,
    loginOtp,
    loginSuccess,

    // CR
    regCR: regSuccess / regAttempts,
    loginCR: loginSuccess / loginAttempts,

    // cost
    otpCost,
    supportCost,
    totalCost: otpCost + supportCost,

    // probabilities
    pPage,
    pFieldsReg,
    pFieldsLogin,
    pOtp
  };
}