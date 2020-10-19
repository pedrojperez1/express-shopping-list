const express = require("express");
const ExpressError = require("../expressError");

let items = require("../fakeDb");
const { nextTick } = require("process");

const router = new express.Router();

router.get("/", (req, res) => {
    res.json(items);
});

router.get("/:name", (req, res) => {
    const item = items.find(i => i.name === req.params.name);
    if (item) {
        res.json(item);
    } else {
        throw new ExpressError("Item not found", 404)
    }
});

router.post("/", (req, res) => {
    if (req.body.name && req.body.price) {
        const newItem = {
            "name": req.body.name, 
            "price": req.body.price
        }
        items.push(newItem);
        res.status(201).json({"added": newItem})
    } else {
        throw new ExpressError("Item needs a name and price", 400)
    }
});

router.patch("/:name", (req, res) => {
    const itemIndex = items.findIndex(i => i.name === req.params.name);
    if (itemIndex !== undefined) {
        const newItem = {
            "name": req.body.name, 
            "price": req.body.price
        }
        items.splice(itemIndex, 1, newItem);
        res.status(200).json({"updated": newItem})
    } else {
        throw new ExpressError("Item not found", 404);
    }
});

router.delete("/:name", (req, res) => {
    const itemIndex = items.findIndex(i => i.name === req.params.name);
    if (itemIndex !== undefined) {
        items.splice(itemIndex, 1);
        res.status(200).json({"message": "Deleted"})
    } else {
        throw new ExpressError("Item not found", 404);
    }
});

module.exports = router;