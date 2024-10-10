const sdk = require('api')('@msg91api/v5.0#6n91xmlhu4pcnz');

sdk.auth('102856ABHD5nwUDlW569f0261');
sdk.sendSms({
  template_id: '1201162113782075292',
  short_url: '0',
  data: 'Your OTP for login in WUN app/website is 1100 When You Need.',
  recipients: [{mobiles: '919516703294'}]
})

  .then(( {data} ) => console.log(data))
  .catch(err => console.error(err));

  
