const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyparser.json());


const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');

const options={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Swagger API in Node.js',
            version:'1.0.0'
        },
        servers:[
            {
                url:'http://localhost:3000/'
            }
        ]
    },
    apis:['./index.js']
}

const swaggerspec = swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerspec))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vegmartdatabase',
    port: 3307
});

db.connect(err=>{
    if(err){console.log(err, 'db err');}
    console.log('Database connected...');
});

/**
 * @swagger
 * /vegetables/getAllProducts:
 *  get:
 *      summary: API for getting all user data
 *      description: get is working
 *      responses:
 *          200:
 *              description: Get all user data
 * 
 */

app.get('/vegetables/getAllProducts',(req,res)=>{
    let qr=`select * from vegetables`;
    db.query(qr,(err,result)=>{
        if(err){
            console.log(err,'errs');
        }
        if(result.length>0){
            res.send({
                message:'all user data',
                data:result
            });
        }
    });
});


/**
 * @swagger
 * /categories/getAllCategory:
 *  get:
 *      summary: API for getting all category data
 *      description: get is working
 *      responses:
 *          200:
 *              description: Get all category data
 * 
 */

app.get('/categories/getAllCategory',(req,res)=>{
    let qr = `select * from categories`;
    db.query(qr,(err,result)=>{
        if(err){console.log(err,'errs');}
        if(result.length>0){
            res.send({
                message:'all categories',
                data:result
            });
        }
    })
});

/**
 * @swagger
 *  components:
 *      schemas:
 *          vegetables:
 *              type: object
 *              properties: 
 *                  name:
 *                      type: string
 *                  shortName:
 *                      type: string
 *                  category:
 *                      type: string
 *                  price:
 *                      type: integer
 *                  timeSpan:
 *                      type: string
 *                  imageUrl:
 *                      type: string
 *                  description:
 *                      type: string
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          categories:
 *              type: object
 *              properties: 
 *                  message:
 *                      type: string
 *                  categoryID:
 *                      type: integer
 *                  categoryName:
 *                      type: string
 */

/**
 * @swagger
 * /vegetables/createProduct:
 *  post:
 *      summary: API for adding new data.
 *      description: API used to create new vegetable data.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/vegetables'
 *      responses:
 *          200:
 *              description: New vegetable added succssfully     
 */

app.post('/vegetables/createProduct',(req,res)=>{ 
    
    let Name=req.body.name;
    let ShortName=req.body.shortName;
    let Price= req.body.price;
    let Category=req.body.category;
    let TimeSpan = req.body.timeSpan;
    let ImageUrl = req.body.imageUrl;
    let Description = req.body.description;

    let qr= `insert into vegetables(name,shortName,price,category,timeSpan,imageUrl,description) values('${Name}','${ShortName}','${Price}','${Category}','${TimeSpan}','${ImageUrl}','${Description}')`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({"message":"Data inserted"});
    });
})

/**
 * @swagger
 * /vegetables/updateVegetable/{id}:
 *  put:
 *      summary: API for updating vegetable data.
 *      description: API used to update vegetable data.
 *      parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric id required
 *           schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/vegetables'
 *      responses:
 *          200:
 *              description: Vegetable data updated succssfully   
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/vegetables'  
 */

app.put('/vegetables/updateVegetable/:id',(req,res)=>{

    let gID=req.params.id;
    let Name=req.body.name;
    let ShortName=req.body.shortName;
    let Price=req.body.price;
    let Category=req.body.category;
    let TimeSpan=req.body.timeSpan;
    let ImageUrl=req.body.imageUrl;
    let Description=req.body.description;

    let qr=`update vegetables set name='${Name}',shortName='${ShortName}',price='${Price}',category='${Category}',timeSpan='${TimeSpan}',imageUrl='${ImageUrl}',description='${Description}' where id='${gID}' `;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}

        res.send({
            message:'Data updated'
        });
    })
})

/**
 * @swagger
 * /vegetables/deleteVegetable/{id}:
 *  delete:
 *      summary: API for deleting vegetable data.
 *      description: API used to delete vegetable data.
 *      parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric id required
 *           schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/vegetables'
 *      responses:
 *          200:
 *              description: User data deleted succssfully   
 */

app.delete('/vegetables/deleteVegetable/:id',(req,res)=>{
    let gId=req.params.id;
    let qr=`delete from vegetables where id='${gId}'`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'Data deleted'
        })
    })
})

/**
 * @swagger
 * /vegetables/productByCategory/{id}:
 *  get:
 *      summary: API for getting vegetable data based on specific category.
 *      description: API used to get vegetable data.
 *      parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric id required
 *           schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Vegetable data sent succssfully   
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/categories'  
 */

app.get('/vegetables/productByCategory/:id',(req,res)=>{
    let gId=req.params.id;
    let qr=`select * from vegetables v join categories c on v.category=c.categoryID where v.category='${gId}'`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err)}
        res.send({
            message:'Product by category',
            data:result
        })
    })
})

/**
 * @swagger
 *  components:
 *      schemas:
 *          user:
 *              type: object
 *              properties: 
 *                  username:
 *                      type: string
 *                  name:
 *                      type: string
 *                  mobile:
 *                      type: integer
 *                  password:
 *                      type: string
 */

/**
 * @swagger
 * /user/createUser:
 *  post:
 *      summary: API for creating new user.
 *      description: API used to create new user.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/user'
 *      responses:
 *          200:
 *              description: new user added succssfully     
 */


app.post('/user/createUser',(req,res)=>{
    let userId=req.body.username;
    let Name= req.body.name;
    let Mobile=req.body.mobile;
    let Password = req.body.password;

    let qr=`Insert into user(userid,name,mobile,password) values('${userId}','${Name}','${Mobile}','${Password}')`;

    db.query(qr,(err,result)=>{
        if(err){console.log(err);}
        res.send({
            message:'New user created',
            data:result
        })
    })
})

app.listen(3000,()=>{
    console.log('Server running..');
});