const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb+srv://DeepakBhagat:Bhagat1242@cluster0.f5aehuu.mongodb.net/todoDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase(); // Call the function to connect to the database

const itemSchema = mongoose.Schema({
    name: String,
});

const Item = mongoose.model("Item", itemSchema);

        const item1 = new Item({ name: "Welcome to do list.." });
        const item2 = new Item({ name: "Hit + sign to add some more task.." });
        const item3 = new Item({ name: "<----Hit this checkbox after completion of the task.." });

const inseteditems = [item1,item2,item3];





app.get('/',function(req,res){
    var today = new Date();
    var currentDay = today.getDay();
    var day = " ";
    
    var options ={
        weekday: "long",
        day : "numeric",
        month: "long",
    };
    var day = today.toLocaleDateString("en-US",options);
    var items = [];
    async function finditem(){
        try {
            items = await Item.find({});
            console.log("Found items using async/await:", items);

            if(items.length === 0){
                Item.insertMany(inseteditems);

                res.redirect("/");
            }
            else{
                res.render("list",{thatday:day,newitems:items});
            }

        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    finditem();
    
});

app.post('/',function(req,res){
 var itemName = req.body.newitem;
 const itemn = new Item({
    name : itemName,
 });

 itemn.save();

 res.redirect('/');
});

app.post('/delete', async function (req, res) {
    var deletedID = req.body.deleted;
    try {
        await Item.findByIdAndRemove(deletedID);
        console.log("Item deleted successfully");
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send("Internal Server Error");
    }
}); 





app.listen(process.env.PORT || 8080,function(error){
     
     console.log("Server is up and running at port 8080");
})