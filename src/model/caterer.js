let Caterer = [
    {
        id:1,
        name:"St. John & St. Thomas Catering",
        isFavourite : true,
        address:"3200 Williams Street, Nathan Road, MA",
        rating: 4 ,
        food_category:"Chinese Food",
        price:80,
        image:"https://theclubmumbai.com/wp-content/uploads/2019/09/j009-2.jpg",
        bio:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        categories:{
            Noodles : [
                {
                    id: 0,
                    name:"Pan Fried Noodles",
                    image:"https://photos.bigoven.com/recipe/hero/pan-fried-noodles-with-fullblo-8bc3e7.jpg?h=300&w=300",
                    price:13.59,
                    description:"Pan Fried Noodles with Vegetables is a delicious Asian recipe. The crunchy texture of the noodles soaked in flavorful vegetable broth makes for a perfect delicacy."
                },
                {
                    id: 1,
                    name:"Hunan Noodles",
                    image:"https://lh3.googleusercontent.com/vEZJOm8veuZTXiP4R2cJ3izRoMIRhwm2ePsEdw2rKievJWBPYpfL-hB_K459QeYYw6tSS9BNk3Jg883MyajeoTdlhyQ=w256",
                    price:11.99,
                    description:"Noodles tossed in spicy & delicious Hunan Sauce. Easy to prepare and very delightful dish."
                },
                {
                    id: 2,
                    name:"Sichuan Noodles",
                    image:"https://rasamalaysia.com/wp-content/uploads/2017/09/spicy-sichuan-noodles-thumb.jpg",
                    price: 10.99,
                    description:"Spicy Sichuan Noodles - cold noodles in a spicy, savory and numbing Sichuan sauce."
                },
                {
                    id: 3,
                    name:"Stir-Fried Noodles",
                    image:"https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2Farchive%2Fcf5bee0e51808e011710c49e913ff003b757e747",
                    price:13.59,
                    description:"Stir-Fried Noodles are quick to prepare, and serve as the perfect backdrop for everything from sliced chicken breast to tender bok choy."
                }
            ],
            Rice: [
                {
                    id: 4,
                    name:"Chilli Garlic Rice",
                    image:"https://photos.bigoven.com/recipe/hero/schezwan-veggies-brown-rice-d9609b7fc96f2f0542d78151.jpg?h=300&w=300",
                    price:16.99,
                    description:"Rice tossed with finely diced vegetables, fresh chilly and garlic. ( SPICY )"
                },
                {
                    id: 5,
                    name:"Korean Rice",
                    image:"https://photos.bigoven.com/recipe/hero/kimchi-fried-rice-0f5ffd.jpg?h=300&w=300",
                    price:12.59,
                    description:"Aromatic Rice tossed with star anise, cottage cheese and chilli flakes."
                },
                {
                    id: 6,
                    name:"Pot Rice with Cottage Cheese",
                    image:"https://i.pinimg.com/474x/84/3f/a4/843fa484de8e0eb20d81924b7c97f55a.jpg",
                    price:11.99,
                    description:"Fragrant rice saut'ed & topped with exotic vegetables, mushroom and cottage cheese."
                },
                {
                    id: 7,
                    name:"Burnt Garlic Rice",
                    image:"https://d3gy1em549lxx2.cloudfront.net/303e5329-76c3-437a-b4e1-c7e9e1d09526.JPG",
                    price:10.59,
                    description:"Rice tossed in spices, burnt garlic and chillies. ( SPICY ) "
                },
            ],
            Momos:[
                {
                    id: 8,
                    name:"Vegetable Steamed Momos",
                    image:"https://photos.bigoven.com/recipe/hero/delicious-chicken-momos-recipe-cca891.jpg?h=300&w=300",
                    price:6.99,
                    description:"Steamed Dumplings filled with exotic vegetables."
                },
                {
                    id: 9,
                    name:"Fried Momos",
                    image:"https://b.zmtcdn.com/data/pictures/7/19032567/8edf259f00f1078177a286552e72e7f1.jpg?fit=around|771.75:416.25&crop=771.75:416.25;*,*",
                    price:7.99,
                    description:"Vegetable momos fried in oil."
                },
                {
                    id: 10,
                    name:"Sichuan Chilli Oil Steamed Momos",
                    image:"https://www.mygingergarlickitchen.com/wp-content/rich-markup-images/1x1/1x1-steamed-veg-momos-spicy-chili-chutney-vegetable-momos-recipe-video.jpg",
                    price:9.99,
                    description:"Steamed Momos filled with exotic vegetables topped with Sichuan Chilli Oil. ( SPICY )"
                },
            ],
        }
        
    },
    {
        id:2,
        name:"Williams Catering",
        isFavourite : false,
        address:"250, Johnson Street, Washington DC, USA",
        rating: 4,
        food_category:"Continental Food",
        price:75,
        image:"https://5.imimg.com/data5/DU/RH/JA/ANDROID-24797380/product-jpeg-500x500.jpg",
        bio:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        categories:{
            Soups:[
                {
                    id:11,
                    name:"Roasted Tomato & Basil Soup",
                    image:"https://photos.bigoven.com/recipe/hero/slow-roasted-tomato-basil-soup-3.jpg?h=300&w=300",
                    price:7.99,
                    description:"Tomatoes, Leek, Celery, Garlic, Shallots, Butter, Pepper and Basil"
                },
                {
                    id:12,
                    name:"Dal Shorba",
                    image:"https://bigoven-res.cloudinary.com/image/upload/t_recipe-256/instant-pot-dal-fry-spiced-lentil-soup-2503667.jpg",
                    price:6.99,
                    description:"Lentil, pepper, coriander, lime, bay leaf and cumin."
                },
                {
                    id:13,
                    name:"Asian Vegetable Hot and Sour Soup",
                    image:"https://bigoven-res.cloudinary.com/image/upload/t_recipe-256/hot-and-sour-soup-recipe-indo--a2c2e0-d74bbd4226b7bb887f3e3db3.jpg",
                    price:6.99,
                    description:"Shredded vegetables, soya, Chilli and vinegar"
                },
            ],
            Pizza:[
                {
                    id:14,
                    name:"Margherita Pizza (10 inch)",
                    image:"https://lh3.googleusercontent.com/5hMatlabFCdqDndkHbaBxeoeNjcCEuneiqL5ykszDdyaTGQTTIJXAw05loIQq6Qlf4c4jTgziv5sOLUSMzdcI1L-Auk=w256",
                    price:12.99,
                    description:"Classic combination of tomatoes, mozarella and fresh basil"
                },
                {
                    id:15,
                    name:"Paneer Tikka Indian Pizza",
                    image:"https://www.andamanfoods.com/upload/1594122957-paneer%20tikka%20pizza.jpg",
                    price:13.99,
                    description:"Indian take on a classic pizza with Cottage Cheese cubes, tomato sauce and exotic vegetables."
                },
                {
                    id:16,
                    name:"Sicilian Pizza",
                    image:"https://b.zmtcdn.com/data/reviews_photos/fd1/ba053c6bc05259c76aa4bcdecd208fd1_1551953199.jpg?fit=around|300:273&crop=300:273;*,*",
                    price:15.99,
                    description:"Olives, Jalapeno, Bell Peppers, American Corn and Mushrooms!"
                },
            ],
            Burgers:[
                {
                    id:17,
                    name:"Tex Mex Burger",
                    image:"https://www.onegreenplanet.org/ezoimgfmt/149366112.v2.pressablecdn.com/wp-content/uploads/2014/05/Vegan-for-fun_Tex-Mex-Burger.jpg?ezimgfmt=rs:412x448/rscb2/ng:webp/ngcb2",
                    price:9.99,
                    description:"Grilled beans, zucchini & corn patty, lettuce, jalapenos, tomato slices, & whole wheat buns loaded with cheese slices!"
                },
                {
                    id:18,
                    name:"Veggie Burger",
                    image:"https://www.indianhealthyrecipes.com/wp-content/uploads/2016/02/veg-burger-recipe-1.jpg",
                    price:7.99,
                    description:"An everyday classic burger with a delectable patty filled with potatoes, carrots and tasty indian spices, topped with crunchy lettuce and mayonnaise"
                },
            ]
        }
    }
]

export default Caterer;