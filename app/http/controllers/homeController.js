 const Menu = require('../../dbTable/menu');
 function homeController()
 {
     return{
         async index(req,res){
             const pizzas = await Menu.find()
             console.log(pizzas)
             return res.render('home',{pizzas:pizzas})
             
             // 1st pizzas key accessable in front page; 2nd pizzas is data from db
         }
         



     }
 }

 module.exports = homeController