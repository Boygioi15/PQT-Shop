export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

export const getSizeAndColorOptions = (productData) => {
    // Lọc các màu sắc trùng lặp
    const colorOptions = [
        ...new Map(
            productData.types.map((type) => [type.color_name, {
                label: type.color_name
            }])
        ).values()
    ];
    // Lọc các kích cỡ trùng lặp
    const sizeOptions = [
        ...new Map(
            productData.types.flatMap((type) =>
                type.details.map((detail) => [detail.size_name, {
                    label: detail.size_name
                }])
            )
        ).values()
    ];
    return {
        colorOptions,
        sizeOptions
    };
};


export const transformProductData = (productData) => {
    const products = productData.types.flatMap((type) =>
        type.details.map((detail) => ({
            price: detail.price,
            sku: detail.sku,
            color: type.color_name,
            size: detail.size_name,
        }))
    );
    return products;
};

export const getPriceAndSku = (color, size, variations) => {
    const matchingVariation = variations.find(
        (variation) => variation.color === color && variation.size === size
    );

    if (matchingVariation) {
        return {
            price: matchingVariation.price,
            sku: matchingVariation.sku
        };
    } else {
        return [];
    }
};