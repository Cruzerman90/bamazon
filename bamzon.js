var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Wildflowers90!",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  makeTable();
})

var makeTable = function(){
  connection.query('SELECT * FROM products', function(err,res){
    for (var i=0; i<res.length; i++){
      console.log(res[i].itemid+' || '+res[i].productname+' || '+res[i].departmentname+' || '+res[i].price+' || '+res[i].stockquantity);
    }
    promtCustomer(res);
  })
}

var promtCustomer = function(res){
  inquirer.prompt({
    type:'input',
    name:'choice',
    message:'What would you like to purchase? [Quit with (Ctrl+c)]'
  }).then(function(answer){
    var correct = false;
    for(var i=0;i<res.length;i++){
      if(res[i].productname==answer.choice){
        correct=true;
        var product=answer.choice;
        var id=i;
        inquirer.prompt({
          type:'input',
          name:'quantity',
          message:'How many would you like to buy?',
          validate: function(value){
            if(isNaN(value)==false){
              return true;
            }else{
              return false;
            }
          }
        }).then(function(answer){
          if((res[id].stockquantity-answer.quantity)>0){
            connection.query("UPDATE products SET stockquantity='"+(res[id].stockquantity-answer.quantity)+"' WHERE productname='"+product+"'", function(err,res2){
              console.log("product Bought!");
              makeTable();
            })
          } else {
            console.log("not a Valid Selection!");
            promtCustomer(res);
          }
        })
      }
    }
  })
}