const express=require('express')
const app=express()
const body=require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/car_inventory',(err,database)=>{
    if(err){
        console.log(err);
    }
    db=database.db('car_inventory')
    app.listen(4018,()=>{
        console.log('Server is listening at port 4018')
    })
})
app.set('view engine','ejs')
app.use(body.urlencoded({extended:true}))
app.use(body.json())
app.use(express.static('public'))
app.get('/',(req,res)=>{
    db.collection('inventory').find().toArray((err,result)=>{
        if(err){
            return console.log(err);
        }
        res.render('home.ejs',{data:result})
    })
})
app.get('/add',(req,res)=>{
    res.render('add.ejs')
})
app.get('/update',(req,res)=>{
    res.render('update.ejs');
})
app.get('/delete',(req,res)=>{
    res.render('delete.ejs');
})
app.get('/sales',(req,res)=>{
    db.collection('sales').find().toArray((err,result)=>{
        if(err){
            return console.log(err);
        }
        res.render('sales.ejs',{data1:result})
    })
})
app.get('/updatesales',(req,res)=>{
    res.render('updatesales.ejs');
})
app.post('/addData',(req,res)=>{
    console.log(req.body.cid);
    db.collection('inventory').find({car_id:req.body.cid}).count((err,result)=>{
        if(err){
            return console.log(err);
        }
        if(result==0){
            db.collection('inventory').insertOne({car_id:req.body.cid,c_brand:req.body.cb,c_name:req.body.cn,yom:req.body.cy,price:req.body.cp,stock:req.body.cs},(err,result)=>{
                if(err){
                    return console.log(err)
                }
                res.redirect('/')
            });
        }
        else{
            res.send('Product exist')
        }
    });
    //console.log(k)
    /*if(k==0){
        db.collection('inventory').save(req.body,(err,result)=>{
            if(err){
                return console.log(err)
            }
            res.redirect('/')
        })
    }*/
    /*else{
        res.send('The product already exist')
        //res.redirect('/')
    }*/
})
app.post('/updateData',(req,res)=>{
    db.collection('inventory').find({car_id:req.body.cid1}).count((err,m)=>{
        if(err){
            return console.log(err);
        }
        if(m==0){
            res.send('No product exist with this car id');
            //res.redirect('/')
        }
        else{
            db.collection('inventory').update({car_id:req.body.cid1},{$set:{stock:req.body.cs1}},(err,result)=>{
                if(err){
                    return console.log(err);
                }
                console.log('stock of car id '+req.body.cid1+' updated');
                res.redirect('/');
            });
        }

    });
})
app.post('/deleteData',(req,res)=>{
    db.collection('inventory').find({car_id:req.body.cid2}).count((err,g)=>{
        if(err){
            return console.log(err);
        }
        if(g==0){
            res.send('No product exist with this car id');
            //res.redirect('/')
        }
        else{
            db.collection('inventory').findOneAndDelete({car_id:req.body.cid2},(err,result)=>{
                if(err) return console.log(err)
            console.log('Car with id '+req.body.cid2+' deleted')
            res.redirect('/')
            });
        }
    });
})
app.post('/updateSalesData',(req,res)=>{
    db.collection('sales').find({sid:req.body.sid1}).count((err,h)=>{
        if(err){
            return console.log(err);
        }
        if(h==0){
            res.send('No product with this Sales Id');
            //res.redirect('/');
        }
        else{
            db.collection('sales').update({sid:req.body.sid1},{$set:{pdate:req.body.pd1,crr_pur:req.body.cs1,total_sal:req.body.ts}},(err,result)=>{
                if(err){
                    return console.log(err);
                }
                console.log('Sales of car with sales id '+req.body.sid1+' updated')
                res.redirect('/')
            });
    
        }

    });
})