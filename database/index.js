const mongoose = require('mongoose');
const faker = require('faker');

const mongoDB = 'mongodb://database/topSidebar';
mongoose
.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connected'))
.catch(err => console.log('DB connection error: ', err))

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error: '));

const Schema = mongoose.Schema;

let storeSchema = new Schema({
  username: String,
  rating: Number,
  salesNum: Number,
  store_id: Number
})

let Store = mongoose.model('Store', storeSchema);

let productSchema = new Schema({
  bestseller: Boolean,
  category: String,
  color: [{type: String}],
  personalizationDescription: String,
  end: Boolean,
  name: String,
  personalization: String,
  price: Number,
  product_id: Number,
  quantity: Number,
  saleEnd: Boolean,
  size: [{type: String}],
  stock: [{type: String}],
  store_id: Number
})

let Product = mongoose.model('Product', productSchema)


// Store stores in database
const storeDB = () => {
  let storeNum = 0;

  for (let i = 1; i < 21; i++) {
    let oneStore = new Store({
      rating: faker.random.number({min: 1, max: 5}),
      salesNum: faker.random.number({min: 1, max: 10000}),
      store_id: i,
      username: faker.internet.userName(),
    })

    oneStore.save((err) => {
      if (err) {
        throw err;
      }
    })
    storeNum = i;
  }
  console.log(storeNum + ' stores stored in database')

}

const colorGen = () => {
  let colors = [];
  for (let i = 0; i < (Math.floor(Math.random() * 10 + 2)); i++) {
    let color = faker.commerce.color();
    if (colors.includes(color)) {
      i--
    } else {
      colors.push(color)
    }
  }
  return colors;
}


// Store products in database
const productDB = () => {
  let productNum = 1;

  for (let i = 1; i <= 100; i ++) {
    let oneProduct = new Product({
      bestseller: faker.random.boolean(),
      end: faker.random.boolean(),
      name: faker.commerce.productName(),
      personalization: faker.random.boolean(),
      personalizationDescription: faker.lorem.paragraph(),
      product_id: i,
      price: faker.finance.amount(),
      saleEnd: faker.random.boolean(),
      stock: ["In stock", "Only 1 available", "Low in stock"],
      store_id: faker.random.number({min: 1, max: 20})
    });

    if (i <= 25) {
      oneProduct.category = 'clothing';
      oneProduct.color = colorGen();
      oneProduct.quantity = faker.random.number({min: 1, max: 500});
      oneProduct.size = ["Small", "Medium", "Large"];
    } else if (i <= 50) {
      oneProduct.category = 'art';
    } else if (i <= 75) {
      oneProduct.category = 'jewelry';
    } else {
      oneProduct.category = 'misc';
      oneProduct.color = colorGen();
      oneProduct.quantity = faker.random.number({min: 1, max: 500});
      oneProduct.size = ["Small", "Medium", "Large"];
    }

    oneProduct.save((err) => {
      if (err) {
        console.log('Error storing ' + oneProduct.product_id + ' in database')
      }
    })
    productNum = i;
  }

  console.log(productNum + ' products stored in database');
}


const storeStore = () => {
  // if (db.Store) {
    Store.deleteMany({}, err => {
      if (err) {
        console.log('Error deleting Store model instance')
      } else {
        console.log('Deleted Store model instance')
        storeDB();
      }
    })
  // }
}

const storeProduct = () => {

    Product.deleteMany({}, err => {
      if (err) {
        console.log('Error deleting Product model instance')
      } else {
        console.log('Deleted Product model instance')
        productDB();
      }
    })
}

module.exports = {
  Store,
  Product,
  storeStore,
  storeProduct
}