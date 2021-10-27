// import { initializeApp } from 'firebase/app';
// import { auth } from 'firebase/auth';
const phoneNumberField = document.getElementById('phoneNumber');
const codeField = document.getElementById('code');
const getCodeButton = document.getElementById('getCode');
const signInWithPhoneButton = document.getElementById('signInWithPhone');

const auth = firebase.auth();

// // TODO: Replace the following with your app's Firebase project configuration
// const firebaseConfig = {
//   //...
// };

// Creates and render the captcha
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
recaptchaVerifier.render().then(widgetId => {
  window.recaptchaWidgetId = widgetId;
})

const sendVerificationCode = () => {
  const phoneNumber = phoneNumberField.value;
  const appVerifier = window.recaptchaVerifier;
  
  // Sends the 6 digit code to the user's phone
  auth.signInWithPhoneNumber(phoneNumber, appVerifier)
  .then(confirmationResult => {
    console.log("confirmation result : ", confirmationResult);
    const sentCodeId = confirmationResult.verificationId;
    
    // Sign in if the verification code is set correctly
    signInWithPhoneButton.addEventListener('click', () => signInWithPhone(sentCodeId));
  })
}

const signInWithPhone = sentCodeId => {
  const code = codeField.value;

  var obj ={sentCodeId,code}
  console.log("object ::",obj)
  console.log("User Register");
  const data = {otp: code,verificationId: sentCodeId};
  const e = JSON.stringify(data);
  console.log("e :: ",e)
  //api
  fetch(' http://localhost:8080/firebase', {
    method: 'POST',
    body:e,
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  }).then(function (response) {
    console.log("response ok !")
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    console.log("data then:",data);
  }).catch(function (error) {
    console.warn('Something went wrong.', error);
  });
  

  // A credential object (contains user's data) is created after a comparison between the 6 digit code sent to the user's phone
  // and the code typed by the user in the code field on the html form.
  const credential = firebase.auth.PhoneAuthProvider.credential(sentCodeId, code);
  console.log("credentials:",credential);
  auth.signInWithCredential(credential)
  .then(() => {
    console.log('Signed in successfully !');
    // window.location.href()
    // window.location.assign('./profile');
  })
  .catch(error => {
    console.error(error);
  })
}

getCodeButton.addEventListener('click', sendVerificationCode);

// const app = initializeApp(firebaseConfig);