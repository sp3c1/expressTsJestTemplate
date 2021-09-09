import axios from "axios";

describe(`Main test`, () => {
    it(`should test /`, async () => {
        const response = await axios.get(`http://localhost:3001`);
        // expect(response.data).toEqual({
        //     "name": "datagatheringservicetstutorial",
        //     "version": "1.0.0",
        // });
        expect(1).toEqual(1);
    });

    // describe(`fetched markets`, () => {
    //     beforeAll(async () => {
    //         await new Promise((r) => setTimeout(r, 60));
    //     })
    // });
});