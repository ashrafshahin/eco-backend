const calculateSalePrice = (price, discount) => {

    let salePrice = price ;

    if (!discount || discount.type === 'none') {
        return salePrice
    };

    const now = new Date();

    if (
        discount.startDate &&
        discount.endDate &&
        (now < new Date(discount.startDate) ||
            now > new Date(discount.endDate))
    ) {
        return salePrice;
    };

    if (discount.type === 'percentage') {
        // salePrice = 100 - (100 * 10 / 100) = 90
        salePrice = price - (price * discount.value) / 100;

    };

    if (discount.type === 'flat') {
        // 100 - 10 = 90
        salePrice = price - discount.value
    };

    return Math.max(salePrice, 0);

};

module.exports = calculateSalePrice;