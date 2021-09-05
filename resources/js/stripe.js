
import { CardWidget } from './CardWidget'
import { loadStripe } from '@stripe/stripe-js'
import { placeOrder } from './apiService';


export async function initStipe(){

    const stripe =  await loadStripe('pk_test_51JWGEpSDkS9BPWbrJDiQ2pJxwA1Iuxo1tphcn1d06fzN1gxf2YAH0d7bWzjsQlbfPlRDziGic1ovJgA9bFxr32RT00d2My5bJe')
    let card = null;
    const paymentType = document.querySelector('#paymentType')
    if(!paymentType){
        return;
    }
    paymentType.addEventListener('change',(e) =>
    {
            //console.log(e.target.value)
        if(e.target.value === 'card')
        { // Display widget
           card = new CardWidget(stripe)
           card.mount()

        } else 
        { // Display cod method
            card.destroy()
        }
    })
    const paymentForm = document.querySelector('#payment-form')
    if(paymentForm)
    {
        paymentForm.addEventListener('submit', async (e)=>{
        // console.log(e)
        //console.log(paymentForm)
            e.preventDefault()
            let formData = new FormData(paymentForm)
            let formObj = {}
            //console.log(formData)
            for (let [key, value] of formData.entries()) 
            {//console.log(key, value)
                formObj[key] = value
            }
            //console.log(formObj)
            if(!card){// Ajex call
                placeOrder(formObj)
                return
            }

            const token = await card.createToken() 
            formObj.stripeToken = token.id  
            placeOrder(formObj)  
        })
    }
    
    
   
}