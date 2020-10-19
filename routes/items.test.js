process.env.NODE_ENV = "test";

const { timeStamp } = require("console");
const { hasUncaughtExceptionCaptureCallback } = require("process");
const request = require("supertest");
const app = require("../app");
const items = require("../fakeDb");

describe("Test all items routes", () => {
    let skittles = { "name": "skittles", "price": 2.99 };
    beforeEach(() => {
        //  prepopulate items array
        items.push(skittles);
    });

    afterEach(() => {
        // reset items array
        items.length = 0;
    });

    test("GET /items should return all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([skittles]);
    });

    test("GET /items/:name should return a single matching item", async () => {
        const res = await request(app).get(`/items/${skittles.name}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(skittles);
    });

    test("POST /items should add the item provided in the JSON body", async () => {
        const newItem = {"name": "pikachu", "price": 50};
        const res = await request(app)
            .post("/items")
            .send(newItem);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({"added": newItem});
        expect(items.length).toEqual(2);
    });

    test("PATCH /items/:name should modify the item with given name", async () => {
        const updated = {"name": "snickers", "price": 3.99}
        const res = await request(app)
            .patch(`/items/${skittles.name}`)
            .send(updated);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({"updated": updated});
        expect(items.length).toEqual(1);
    });

    test("DELETE /items/:name should delete the item with given name", async () => {
        console.log(`items: ${items}`);
        const res = await request(app).delete(`/items/${skittles.name}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({"message": "Deleted"});
        expect(items.length).toEqual(0);
    })
})
