describe("the todo app", () => {
  beforeEach(async () => {
    await driver.get(tp.url);
  })
  afterAll(async () => {
    await driver.quit();
  });
  it("can add a todo", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do\n");
  });
  it("can remove a todo", async () => {
    let myTodos = await driver.findElements(tp.todos);
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
      .findElement(tp.todoComplete)
      .click();
    await (await driver.findElement(tp.clearCompletedButton)).click();
    myTodos = await driver.findElements(tp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tp.todoLabel)).getText()) == "Test To-Do";
    });
    expect(myTodo.length).toEqual(0);
  });
  it("can mark a todo with a star", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    let startingStars = await (await driver.findElements(tp.starBanner)).length;
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do\n");
    await (await driver.findElements(tp.todos))
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
      .findElement(tp.todoStar)
      .click();
    let endingStars = await (await driver.findElements(tp.starBanner)).length;
    expect(endingStars).toBeGreaterThan(startingStars);
  });
  it("has the right number of todos listed", async () => {
    await driver.wait(until.elementLocated(tp.todoInput));
    let startingTodoCount = await (await driver.findElements(tp.todos)).length;
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 1\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 2\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 3\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 4\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 5\n");
    let endingTodoCount = await (await driver.findElements(tp.todos)).length;
    let message = await (await driver.findElement(tp.todoCount)).getText();

    expect(endingTodoCount - startingTodoCount).toBe(5);
    expect(message).toBe(`${endingTodoCount} items left`);
  });
});
