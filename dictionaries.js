const dict = {

  responseTime: [
    {max:100, p:1},
    {max:300, p:0.999},
    {max:500, p:0.995},
    {max:1000, p:0.98},
    {max:2000, p:0.92},
    {max:99999, p:0.8}
  ],

  otpDelivery: [
    {max:5, p:0.99},
    {max:10, p:0.97},
    {max:20, p:0.94},
    {max:60, p:0.88},
    {max:999, p:0.6}
  ],

  fields: [
    {max:2, p:0.99},
    {max:3, p:0.97},
    {max:4, p:0.94},
    {max:5, p:0.9},
    {max:6, p:0.85},
    {max:999, p:0.8}
  ]
};

function getProb(dictName, value) {
  return dict[dictName].find(d => value <= d.max).p;
}