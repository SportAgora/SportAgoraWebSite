 
 
 
 // LOGUIN
   var formSignin = document.querySelector('#signin')
   var formSignup = document.querySelector('#signup')
   var btnColor = document.querySelector('.btnColor')
   var btnSignin = document.querySelector('#btnSignin')
   var btnSignup = document.querySelector('#btnSignup')


   document.querySelector('#btnSignin')
       .addEventListener('click', () => {
       formSignin.style.left = "25px"
       formSignup.style.left = "900px"
       btnColor.style.left = "0px"
       btnSignin.style.color = "var(--branco)"
       btnSignup.style.color = "var(--preto)"
   })

   document.querySelector('#btnSignup')
       .addEventListener('click', () => {
       formSignin.style.left = "-900px"
       formSignup.style.left = "25px"
       btnColor.style.left = "110px"
       btnSignup.style.color = "var(--branco)"
       btnSignin.style.color = "var(--preto)"
       
   }) 
