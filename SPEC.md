# CIAM Product Metrics Simulator

## Цель проекта

Создать интерактивный веб-калькулятор (симулятор) продуктовых метрик системы аутентификации клиентов (CIAM), позволяющий моделировать влияние изменений продукта на бизнес-метрики.

Проект предназначен для:

- Product Manager
- Product Analyst
- UX Designer
- Владельца продукта
- Руководителя разработки

Не является BI системой.

Это симулятор "что будет если".

---

# Стек

Frontend only.

HTML
CSS
Vanilla JavaScript

Без React.
Без backend.
Без сборщиков.

Все вычисления происходят в браузере.

---

# Структура проекта

index.html

style.css

engine.js

app.js

dictionaries.js

---

# Основная идея

Пользователь меняет параметры продукта.

После нажатия "Recalculate"

↓

engine.js считает

↓

UI показывает:

- KPI
- Воронки
- Производные показатели

---

# Главные KPI

Registration CR

Login CR

Activation Rate

Drop-off Rate

OTP Delivery Success

Average Response Time

Availability

Error Rate

Support Rate

Revenue

Cost

Profit

ROI

---

# Основные входные параметры

## Registration

Registration Attempts

Registration Fields

Registration Steps

Registration Method

---

## Login

Login Attempts

Login Fields

Login Steps

Login Method

---

## OTP

OTP Type

SMS

Push

Email

OTP Delivery

OTP Cost

OTP Delay

OTP Type Share, % (SMS/Push/Email/TOTP — реализовано, применяется только к
логину; регистрация всегда шлёт и SMS, и Email одновременно, вне зависимости
от долей)

---

## Биометрия / мобильное приложение

Доля входов по биометрии, % (appShare — реализовано)

Успех входа по биометрии = только стабильность соединения (pPage),
отдельного параметра успешности не требуется

---

## Platform

Response Time

Availability

Error Rate

---

## Support

Support Tickets %

Support Cost

---

## Fraud

Fraud %

Fraud Cost

---

# Воронка регистрации

Registration Attempts

↓

Landing

↓

Registration Form

↓

OTP

↓

Success

↓

Activated

---

# Воронка логина

Login Attempts

↓

Login Page

↓

Login Form

↓

OTP

↓

Successful Login

---

# Что рассчитывает engine.js

Регистрацию

Логин

Потери

Конверсию

Стоимость

Доход

ROI

---

# Логика

Каждый следующий этап

=

предыдущий этап

×

вероятность прохождения

Например

Login Form

=

Login Page

×

pForm

---

# KPI блок

Карточки

Reg CR

Login CR

Activation

OTP Success

Revenue

Cost

Profit

ROI

---

# Экономика

Revenue

Support Cost

OTP Cost

Fraud Cost

Infrastructure Cost

Total Cost

Profit

---

# dictionaries.js

Хранит текстовые описания метрик.

Например

Registration CR

Что означает

Как считается

На что влияет

---

# Что обсуждалось

Метрики должны быть связаны между собой.

Не независимые показатели.

Изменение одной метрики должно менять остальные.

---

# Идея дерева метрик

Все показатели образуют граф зависимостей.

Например

Response Time

↓

Login Success

↓

Conversion

↓

Revenue

↓

Profit

---

# Планировалось

Потом визуализировать дерево зависимостей.

---

# Главные продуктовые метрики

Registration CR

Login CR

Activation Rate

Drop-off Rate

OTP Success

Support Rate

Revenue

Profit

ROI

---

# Принцип расчета

Каждый параметр влияет на вероятность прохождения этапа.

Например

Рост Response Time

↓

уменьшается вероятность прохождения формы

↓

уменьшается Login CR

↓

уменьшается Revenue

---

# Архитектура

index.html

↓

app.js

↓

calculate(inputs)

↓

engine.js

↓

result

↓

render()

---

# UI

Слева

Параметры

Справа

KPI

Ниже

Registration Funnel

Login Funnel

---

# Что уже было реализовано

HTML форма — готова

CSS — готов, стиль flat (без теней, без скруглений, сплошные плоские цвета).
Цветовая тема — Aeroflot brandbook:
- #00205B — основной navy (шапка, заголовки)
- #F27722 — акцентный оранжевый (подчёркивание шапки/заголовков, кнопки)
- #0C347A — вторичный синий (KPI-карточки)
- #E4EDFA — светло-голубой (фон страницы)
- #DCE6F5 — бледно-голубой (воронки, поля ввода)
- #464E5C — тёмно-серый (текст)

GitHub Pages build — добавлен .nojekyll в корень репозитория (сайт статический,
Jekyll-обработка не нужна и была вероятной причиной сбоя сборки)

engine.js — частично:
- воронка регистрации и логина (Attempts → Page → Form → OTP → Success)
- вероятностная модель (response time, uptime, error rate, fields, otp delivery)
- стоимость OTP и стоимость поддержки, total cost
- доли типов OTP (SMS/Push/Email/TOTP, %) настраиваемые, нормализуются к 100%
  и влияют на стоимость OTP при логине; на регистрацию доли не влияют — там
  всегда считается стоимость SMS + Email одновременно (regOtpCost)
- доля входов по биометрии (appShare, %) — эти пользователи входят через
  fingerprint/FaceID, минуя форму и OTP; успех входа зависит только от
  стабильности соединения (pPage — response time, uptime, error rate),
  отдельной вероятности биометрии нет
- KPI "экономия на OTP" (otpSavings) — сравнение фактической стоимости OTP
  с базовым сценарием (100% SMS, без биометрии), чтобы явно показать выгоду
  от push/in-app OTP и биометрии
- нет: Activation, Drop-off, Revenue, Profit, ROI, Fraud cost

dictionaries.js — частично:
- вероятностные таблицы (responseTime, otpDelivery, fields) — готовы
- текстовые описания метрик (что означает / как считается / на что влияет) — не реализованы

app.js — исправлен, больше не обрезан, работает корректно.
Дополнительно реализовано:
- поле "Время отклика, мс" — горизонтальный слайдер (range 20–5000),
  пересчёт и обновление значения происходят при перетаскивании
- сохранение введённых значений: localStorage (STORAGE_KEY
  "ciamSimulatorInputs") + синхронизация с query-параметрами URL при каждом
  recalc(), кнопка "Скопировать ссылку" копирует текущий URL со всеми
  параметрами в буфер обмена; при открытии ссылки с параметрами они имеют
  приоритет над сохранённым в localStorage состоянием

---

# Последняя проблема (решена)

После публикации на GitHub Pages появлялась ошибка:

Uncaught SyntaxError: missing } after function body — app.js line 51

Причина: файл app.js оказался обрезан, из-за этого JavaScript полностью
переставал выполняться.

Статус: исправлено, app.js сейчас полный и валидный.

---

# Что хотелось получить в итоге

Рабочий статический сайт.

После изменения любого параметра

↓

моментально пересчитываются

KPI

Registration Funnel

Login Funnel

Стоимость

Доход

ROI

без backend.

---

# Будущие идеи (не реализованы)

- Дерево метрик
- Анализ чувствительности
- Сценарии
- Экспорт PDF
- Экспорт Excel
- Сравнение двух сценариев
- Граф зависимостей
- Визуализация влияния метрик