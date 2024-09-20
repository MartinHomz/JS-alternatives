const DateMaxValue: Date = new Date(9999, 11, 31, 23, 59, 59, 999);
const UndividedTListId: number = -1;

class Database {
    private static database: Database;
    private constructor() { }

    public static Current(): Database {
        if (!this.database) {
            this.database = new Database();
        }
        return this.database;
    }

    public Server;

    public InitializeDatabase(callback?): void {
        db.open({
            server: 'TodoDB',
            version: 1,
            schema: {
                TodoLists: {
                    key: {
                        keyPath: 'id',
                        autoIncrement: true
                    },
                    indexes: {
                        name: {},
                        icon: {},
                        unfinishedOpened: {},
                        finishedOpened: {},
                        orderTodo: {}
                    }
                },
                Todos: {
                    key: {
                        keyPath: 'id',
                        autoIncrement: true
                    },
                    indexes: {
                        parentId: {},
                        done: {},
                        text: {},
                        important: {},
                        createDate: {},
                        endDate: {},
                        note: {}
                    }
                },
                TodoSteps: {
                    key: {
                        keyPath: 'id',
                        autoIncrement: true
                    },
                    indexes: {
                        parentId: {},
                        done: {},
                        text: {}
                    }
                }
            }
        }).then((s) => {
            this.Server = s;
            if (callback != undefined)
                callback();
        });
    }
    //#region TLists

    public GetAllTLists(callback?): void {
        this.Server.TodoLists.query()
            .all()
            .execute()
            .then((results) => {
                let tlists: TList[] = []
                for (let item of results) {
                    let tlist: TList = new TList(item.id, item.name, item.icon,
                        item.unfinishedOpened, item.finishedOpened, item.orderTodo);
                    tlists.push(tlist);
                }
                if (callback != undefined)
                    callback(tlists);
            });
    }

    public AddTlist(newName: string, callback?): void {
        this.Server.TodoLists.add({
            name: newName,
            icon: "",
            unfinishedOpened: true,
            finishedOpened: false,
            orderTodo: OrderTodo.None
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public AddTlistClass(tlist: TList, callback?): void {
        this.Server.TodoLists.add({
            name: tlist.Name,
            icon: tlist.Icon,
            unfinishedOpened: tlist.UnfinishedOpened,
            finishedOpened: tlist.FinishedOpened,
            orderTodo: tlist.OrderTodo
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public UpdateTList(tlist: TList, callback?): void {
        this.Server.TodoLists.update({
            id: tlist.Id,
            name: tlist.Name,
            icon: tlist.Icon,
            unfinishedOpened: tlist.UnfinishedOpened,
            finishedOpened: tlist.FinishedOpened,
            orderTodo: tlist.OrderTodo
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public RemoveTList(id: number, callback?): void {
        this.Server.TodoLists.remove(id).then(() => {
            this.GetTodosByParentId(id, ((results) => {
                for (let todo of results) {
                    this.RemoveTodo(todo.Id);
                }
                if (callback != undefined)
                    callback();
            }))
        })
    }
    //#endregion TLists
    //#region Todos

    public GetAllTodos(callback?): void {
        this.Server.Todos.query()
            .all()
            .execute()
            .then((results) => {
                let todos: Todo[] = []
                for (let item of results) {
                    let todo: Todo = new Todo(item.id, item.text, item.parentId, item.done,
                        item.important, item.createDate, item.endDate, item.note);
                    todos.push(todo);
                }
                if (callback != undefined)
                    callback(todos);
            });
    }

    public GetTodosByParentId(id: number, callback?): void {
        this.Server.Todos.query()
            .filter("parentId", id)
            .execute()
            .then((results) => {
                let todos: Todo[] = []
                for (let item of results) {
                    let todo: Todo = new Todo(item.id, item.text, item.parentId, item.done,
                        item.important, item.createDate, item.endDate, item.note);
                    todos.push(todo);
                }
                if (callback != undefined)
                    callback(todos);
            });
    }

    public AddTodo(newText: string, todoListId: number, callback?): void {
        this.Server.Todos.add({
            parentId: todoListId,
            done: false,
            text: newText,
            important: false,
            createDate: new Date().toDateString(),
            endDate: DateMaxValue.toDateString(),
            note: ""
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public AddTodoClass(todo: Todo, callback?): void {
        this.Server.Todos.add({
            parentId: todo.ParentId,
            done: todo.Done,
            text: todo.Text,
            important: todo.Important,
            createDate: todo.CreateDate,
            endDate: todo.EndDate,
            note: todo.Note
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public UpdateTodo(todo: Todo, callback?): void {
        this.Server.Todos.update({
            id: todo.Id,
            parentId: todo.ParentId,
            done: todo.Done,
            text: todo.Text,
            important: todo.Important,
            createDate: todo.CreateDate,
            endDate: todo.EndDate,
            note: todo.Note
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public RemoveTodo(id: number, callback?): void {
        this.Server.Todos.remove(id).then(() => {
            this.GetTStepsByParentId(id, ((results) => {
                for (let step of results) {
                    this.RemoveTStep(step.Id);
                }
                if (callback != undefined)
                    callback();
            }))
        })
    }

    public FindTodo(text: string, callback?): void {
        this.Server.Todos.query()
            .filter((todo) => { return todo.text.includes(text); })
            .execute()
            .then((results) => {
                let todos: Todo[] = []
                for (let item of results) {
                    let todo: Todo = new Todo(item.id, item.text, item.parentId, item.done,
                        item.important, item.createDate, item.endDate, item.note);
                    todos.push(todo);
                }
                if (callback != undefined)
                    callback(todos);
            });
    }

    //#endregion Todos

    //#region TSteps

    public GetAllTSteps(callback?): void {
        this.Server.TodoSteps.query()
            .all()
            .execute()
            .then((results) => {
                let steps: TStep[] = []
                for (let item of results) {
                    let step: TStep = new TStep(item.id, item.text, item.parentId, item.done);
                    steps.push(step);
                }
                if (callback != undefined)
                    callback(steps);
            });
    }

    public GetTStepsByParentId(id: number, callback?): void {
        this.Server.TodoSteps.query()
            .filter("parentId", id)
            .execute()
            .then((results) => {
                let steps: TStep[] = []
                for (let item of results) {
                    let step: TStep = new TStep(item.id, item.text, item.parentId, item.done);
                    steps.push(step);
                }
                if (callback != undefined)
                    callback(steps);
            });
    }

    public AddTStep(newText: string, todoId: number, callback?): void {
        this.Server.TodoSteps.add({
            parentId: todoId,
            done: false,
            text: newText
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public AddTStepClass(step: TStep, callback?): void {
        this.Server.TodoSteps.add({
            parentId: step.ParentId,
            done: step.Done,
            text: step.Text
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public UpdateTStep(step: TStep, callback?): void {
        this.Server.TodoSteps.update({
            id: step.Id,
            parentId: step.ParentId,
            done: step.Done,
            text: step.Text
        }).then(() => {
            if (callback != undefined)
                callback();
        });
    }

    public RemoveTStep(id: number, callback?): void {
        this.Server.TodoSteps.remove(id).then(() => {
            if (callback != undefined)
                callback();
        })
    }

    //#endregion TSteps

    public ImportData(json: string, callback): void {
        this.Server.TodoLists.clear().then(() => {
            this.Server.Todos.clear().then(() => {
                this.Server.TodoSteps.clear().then(() => {
                    let content = JSON.parse(json);
                    if (content.TLists != undefined) {
                        for (let item of content.TLists)
                            this.AddTlistClass(item);
                    }
                    if (content.TodoList != undefined) {
                        for (let item of content.TodoList)
                            this.AddTodoClass(item);
                    }
                    if (content.StepList != undefined) {
                        for (let item of content.StepList)
                            this.AddTStepClass(item);
                    }
                    callback();
                });
            });
        });
    }

    public ExportData(callback): void {
        this.GetAllTLists((tlists:TList[]) => {
            this.GetAllTodos((todoList: Todo[]) => {
                this.GetAllTSteps((stepList: TStep[]) => {
                    let undividedTodos:Todo[] = todoList.filter((item:Todo) => { return item.ParentId == UndividedTListId; });
                    if (tlists.length > 0 || undividedTodos.length > 0)
                        callback(JSON.stringify({ TLists: tlists, TodoList: todoList, StepList: stepList }));
                    else
                        callback("");
                });
            });
        });
    }
}
