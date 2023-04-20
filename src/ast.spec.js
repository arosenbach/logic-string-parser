import AST from './ast';



describe("hello", () => {
  it("parses a simple logic string", () => {
    expect(AST.from("1")).toEqual({
      type: "literal",
      value: 1,
    });
  });
});
