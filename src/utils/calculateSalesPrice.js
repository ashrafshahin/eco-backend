const calculateSalePrice = (price, discount) => {

    let salePrice = price ;

    if (!discount || discount.type === 'none') {
        return Math.round(salePrice * 100) / 100;
    };

    const now = new Date();

    if (
        discount.startDate &&
        discount.endDate &&
        (now < new Date(discount.startDate) || now > new Date(discount.endDate))
    ) {
        return Math.round(salePrice * 100) / 100;
    };

    if (discount.type === 'percentage') {
        // salePrice = 100 - (100 * 10 / 100) = 90
        salePrice = price - (price * discount.value) / 100;

    };

    if (discount.type === 'flat') {
        // 100 - 10 = 90
        salePrice = price - discount.value
    };

    return Math.round(Math.max(salePrice, 0) * 100) / 100;

};

module.exports = calculateSalePrice;