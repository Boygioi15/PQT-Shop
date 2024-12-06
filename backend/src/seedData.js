// products
const products = [{
        "name": "Air Max 97",
        "description": "Giày thể thao phong cách với thiết kế đệm khí hiện đại.",
        "init_ThumnbnailURL": "https://example.com/airmax97-thumbnail.jpg",
        "hover_ThumnbnailURL": "https://example.com/airmax97-hover.jpg",
        "categoryRef": ["64b2c7f6d13e2c345e4f8a2b"],
        "reviewsRef": ["64b2c81ad13e2c345e4f8a2c"],
        "gender": "male",
        "brandRef": "64b2c893d13e2c345e4f8a2d",
        "types": [{
                "color_name": "Red",
                "color_ImageURL": [
                    "https://example.com/airmax97-red-1.jpg",
                    "https://example.com/airmax97-red-2.jpg"
                ],
                "details": [{
                        "size_name": "42",
                        "size_moreInfo": "Châu Âu",
                        "price": 2000000,
                        "sold": 10,
                        "inStorage": 50,
                        "sku": "AM97-RD-42"
                    },
                    {
                        "size_name": "43",
                        "size_moreInfo": "Châu Âu",
                        "price": 2000000,
                        "sold": 5,
                        "inStorage": 45,
                        "sku": "AM97-RD-43"
                    }
                ]
            },
            {
                "color_name": "Blue",
                "color_ImageURL": [
                    "https://example.com/airmax97-blue-1.jpg",
                    "https://example.com/airmax97-blue-2.jpg"
                ],
                "details": [{
                        "size_name": "42",
                        "size_moreInfo": "Châu Âu",
                        "price": 2100000,
                        "sold": 15,
                        "inStorage": 60,
                        "sku": "AM97-BL-42"
                    },
                    {
                        "size_name": "43",
                        "size_moreInfo": "Châu Âu",
                        "price": 2100000,
                        "sold": 8,
                        "inStorage": 50,
                        "sku": "AM97-BL-43"
                    }
                ]
            }
        ]
    }, {
        "name": "Nike Air Max 97",
        "slug": "nike-air-max-97",
        "init_ThumnbnailURL": "https://example.com/images/nike-air-max-97.jpg",
        "hover_ThumnbnailURL": "https://example.com/images/nike-air-max-97-hover.jpg",
        "description": "The Nike Air Max 97 redefines running shoes with its lightweight feel and iconic style.",
        "categoryRef": ["6751dc377c76116d3323d27c"], // Refers to 'Shoes'
        "types": [{
                "color_name": "Black",
                "color_ImageURL": [
                    "https://example.com/images/nike-air-max-97-black-1.jpg",
                    "https://example.com/images/nike-air-max-97-black-2.jpg"
                ],
                "details": [{
                        "size_name": "US 9",
                        "size_moreInfo": "EU 42, 27cm",
                        "price": 3500000,
                        "sold": 150,
                        "inStorage": 50,
                        "sku": "NIKE-AM97-BLK-US9"
                    },
                    {
                        "size_name": "US 10",
                        "size_moreInfo": "EU 43, 28cm",
                        "price": 3600000,
                        "sold": 200,
                        "inStorage": 30,
                        "sku": "NIKE-AM97-BLK-US10"
                    }
                ]
            },
            {
                "color_name": "White",
                "color_ImageURL": [
                    "https://example.com/images/nike-air-max-97-white-1.jpg",
                    "https://example.com/images/nike-air-max-97-white-2.jpg"
                ],
                "details": [{
                        "size_name": "US 9",
                        "size_moreInfo": "EU 42, 27cm",
                        "price": 3400000,
                        "sold": 120,
                        "inStorage": 40,
                        "sku": "NIKE-AM97-WHT-US9"
                    },
                    {
                        "size_name": "US 10",
                        "size_moreInfo": "EU 43, 28cm",
                        "price": 3500000,
                        "sold": 180,
                        "inStorage": 25,
                        "sku": "NIKE-AM97-WHT-US10"
                    }
                ]
            }
        ],
        "gender": "male",
        "brandRef": "6751db44391e5afa36a7a1b0",
        "isNew": true,
        "sale": 10
    },
    {
        "name": "Adidas Ultraboost 22",
        "slug": "adidas-ultraboost-22",
        "init_ThumnbnailURL": "https://example.com/images/adidas-ultraboost-22.jpg",
        "hover_ThumnbnailURL": "https://example.com/images/adidas-ultraboost-22-hover.jpg",
        "description": "Experience unparalleled comfort and energy return with the Adidas Ultraboost 22.",
        "categoryRef": ["6751dc377c76116d3323d27c"], // Refers to 'Sports Shoes'
        "types": [{
            "color_name": "Blue",
            "color_ImageURL": [
                "https://example.com/images/adidas-ultraboost-22-blue-1.jpg",
                "https://example.com/images/adidas-ultraboost-22-blue-2.jpg"
            ],
            "details": [{
                    "size_name": "US 8",
                    "size_moreInfo": "EU 41, 26cm",
                    "price": 4000000,
                    "sold": 100,
                    "inStorage": 60,
                    "sku": "ADIDAS-UB22-BLU-US8"
                },
                {
                    "size_name": "US 9",
                    "size_moreInfo": "EU 42, 27cm",
                    "price": 4100000,
                    "sold": 140,
                    "inStorage": 40,
                    "sku": "ADIDAS-UB22-BLU-US9"
                }
            ]
        }],
        "gender": "male",
        "brandRef": "6751db44391e5afa36a7a1b1", // Refers to 'Adidas'
        "isNew": false,
        "sale": 5
    },

    {
        "name": "Puma RS-X",
        "slug": "puma-rs-x",
        "init_ThumnbnailURL": "https://example.com/images/puma-rs-x.jpg",
        "hover_ThumnbnailURL": "https://example.com/images/puma-rs-x-hover.jpg",
        "description": "The Puma RS-X combines bold retro design with modern comfort, perfect for everyday wear.",
        "categoryRef": [
            "6751dc377c76116d3323d27e"
        ],
        "types": [{
            "color_name": "Red",
            "color_ImageURL": [
                "https://example.com/images/puma-rs-x-red-1.jpg",
                "https://example.com/images/puma-rs-x-red-2.jpg"
            ],
            "details": [{
                    "size_name": "US 7",
                    "size_moreInfo": "EU 40, 25cm",
                    "price": 2700000,
                    "sold": 80,
                    "inStorage": 20,
                    "sku": "PUMA-RSX-RED-US7"
                },
                {
                    "size_name": "US 8",
                    "size_moreInfo": "EU 41, 26cm",
                    "price": 2800000,
                    "sold": 100,
                    "inStorage": 30,
                    "sku": "PUMA-RSX-RED-US8"
                }
            ]
        }],
        "gender": "male",
        "brandRef": "6751db44391e5afa36a7a1b2",
        "isNew": true,
        "sale": 15
    }, {
        "name": "Converse Chuck Taylor All Star",
        "slug": "converse-chuck-taylor-all-star",
        "init_ThumnbnailURL": "https://example.com/images/converse-chuck-taylor.jpg",
        "hover_ThumnbnailURL": "https://example.com/images/converse-chuck-taylor-hover.jpg",
        "description": "An iconic design, the Converse Chuck Taylor All Star is a timeless classic loved by generations.",
        "categoryRef": ["6751dc377c76116d3323d27f"],
        "types": [{
            "color_name": "White",
            "color_ImageURL": [
                "https://example.com/images/converse-white-1.jpg",
                "https://example.com/images/converse-white-2.jpg"
            ],
            "details": [{
                    "size_name": "US 6",
                    "size_moreInfo": "EU 39, 24cm",
                    "price": 1800000,
                    "sold": 120,
                    "inStorage": 50,
                    "sku": "CONVERSE-WHITE-US6"
                },
                {
                    "size_name": "US 7",
                    "size_moreInfo": "EU 40, 25cm",
                    "price": 1900000,
                    "sold": 150,
                    "inStorage": 60,
                    "sku": "CONVERSE-WHITE-US7"
                }
            ]
        }],
        "gender": "unisex",
        "brandRef": "6751db44391e5afa36a7a1b4",
        "isNew": true,
        "sale": 10
    }
]

// brand 
[{
        "name": "Nike",
        "description": "Nike is a world-renowned brand known for its high-performance athletic footwear, clothing, and sports equipment."
    },
    {
        "name": "Adidas",
        "description": "Adidas is a multinational corporation that designs and manufactures sports shoes, clothing, and accessories, offering a wide variety of athletic footwear."
    },
    {
        "name": "Puma",
        "description": "Puma is a German multinational corporation that designs and manufactures athletic and casual footwear, apparel, and accessories."
    },
    {
        "name": "Reebok",
        "description": "Reebok, a subsidiary of Adidas, is a global brand specializing in athletic footwear, apparel, and fitness gear, known for its innovation and performance."
    },
    {
        "name": "New Balance",
        "description": "New Balance is an American multinational corporation that makes athletic shoes, apparel, and accessories. Known for its comfortable running shoes."
    },
    {
        "name": "Under Armour",
        "description": "Under Armour is an American company that manufactures sportswear, casual apparel, and footwear, with a focus on high-performance and durable designs."
    },
    {
        "name": "Converse",
        "description": "Converse is an American shoe company known for its Chuck Taylor All-Star sneakers, a classic footwear design that has been popular for decades."
    },
    {
        "name": "Vans",
        "description": "Vans is a brand specializing in skateboarding shoes and apparel. It's known for its durable, comfortable, and stylish footwear."
    }
]

// category