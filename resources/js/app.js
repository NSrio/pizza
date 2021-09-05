import axios from 'axios'
import Noty from 'noty'
import { initStipe } from './stripe'
import { initAdmin } from './admin'
import moment from 'moment'




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

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


   

// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null

order = JSON.parse(order)

let time = document.createElement('small')

function updateStatus(order){

    statuses.forEach((status) => {

        status.classList.remove('step-completed')
        status.classList.remove('current')
    })


    let stepCompleted = true;
    statuses.forEach((status) => {

        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){

            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })



}
//initAdmin()
updateStatus(order)


// Ajex call for order

initStipe()

// socket 

let socket = io()


// Join 
if(order)
{
    socket.emit('join',`order_${order._id}`)
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    
    initAdmin(socket)
    socket.emit('join','adminRoom')
}


socket.on('orderUpdated',(data)=>{                      // listening event emitter

    const updatedOrder = { ...order }                   // used to copy order data in db
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    //console.log(data)
    updateStatus(updatedOrder)
    new Noty({
        type : 'success',
        timeout: 1000,
        text: "Order Updated",
        progressBar : false
      }).show();
})
   
   













