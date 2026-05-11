const emptyFieldValidation = (res, ...fields) => {
    try {
        if (fields.includes("") || fields.includes(undefined) || fields.includes(null)) {
            res.status(400).json({ success: false, message: "Please fill up all the fields..." })
        }
    } catch (error) {
        console.log("error")
        res.status(400).json({ success: false, message: "server error..." })
    }
};

module.exports = { emptyFieldValidation, }

// Q. age - pore space thakle ki trim() use korbo? kivabe?