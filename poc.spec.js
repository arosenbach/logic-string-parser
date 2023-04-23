import {parseExpression} from './poc';

describe("", () => {
    it("should...", () => {
        parseExpression('((1 OR 3) AND 2) OR ((1 OR 3) AND 4)'); //?
        parseExpression('(1 OR 3) AND 2'); //?
        parseExpression("1 OR 3 AND 2"); //?
        parseExpression("1 AND 2 OR 3 AND 4"); //?
    })
});
