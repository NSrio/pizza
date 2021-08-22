import axios from 'axios'
import Noty from 'noty'



let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartcounter')

function updateCart(pizza){
   axios.post('/update-cart',pizza).then(res=>{
      //console.log(cartCounter)
      cartCounter.innerText = res.data.totalQty

      new Noty({
         type : 'success',
         timeout: 1000,
         text: "Item added to cart",
         progressBar : false
       }).show();
   }).catch(err => {
      new Noty({
         type : 'error',
         timeout: 1000,
         text: "Somthing went wrong",
         progressBar : false
       }).show();
   })
}
addToCart.forEach((btn)=>{
   btn.addEventListener('click', () => {
       let pizza = JSON.parse(btn.dataset.pizza)
       console.log(pizza.size)
       updateCart(pizza)
       
     })

})
   
   
   













