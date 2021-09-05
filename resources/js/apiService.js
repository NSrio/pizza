import axios from 'axios'
import Noty from 'noty'


export function placeOrder(formObj){

    axios.post('/orders',formObj).then((res)=>{                     // as we need form data on fronted side
        //console.log(res.data)
        new Noty({
            type : 'success',
            timeout: 1000,
            text: res.data.message,
            progressBar : false
        }).show();
        
        setTimeout(() => {
            window.location.href = 'customers/orders';
        },1000)
    
        }).catch((err)=>{
            new Noty({
                type : 'error',
                timeout: 1000,
                text: err.res.data.message,
                progressBar : false
            }).show();
        })
}