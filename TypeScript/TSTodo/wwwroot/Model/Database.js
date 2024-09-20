var DateMaxValue = new Date(9999, 11, 31, 23, 59, 59, 999);
var UndividedTListId = -1;
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.Current = function () {
        if (!this.database) {
            this.database = new Database();
        }
        return this.database;
    };
    Database.prototype.InitializeDatabase = function (callback) {
        var _this = this;
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
        }).then(function (s) {
            _this.Server = s;
            if (callback != undefined)
                callback();
        });
    };
    //#region TLists
    Database.prototype.GetAllTLists = function (callback) {
        this.Server.TodoLists.query()
            .all()
            .execute()
            .then(function (results) {
            var tlists = [];
            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                var item = results_1[_i];
                var tlist = new TList(item.id, item.name, item.icon, item.unfinishedOpened, item.finishedOpened, item.orderTodo);
                tlists.push(tlist);
            }
            if (callback != undefined)
                callback(tlists);
        });
    };
    Database.prototype.AddTlist = function (newName, callback) {
        this.Server.TodoLists.add({
            name: newName,
            icon: "",
            unfinishedOpened: true,
            finishedOpened: false,
            orderTodo: OrderTodo.None
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.AddTlistClass = function (tlist, callback) {
        this.Server.TodoLists.add({
            name: tlist.Name,
            icon: tlist.Icon,
            unfinishedOpened: tlist.UnfinishedOpened,
            finishedOpened: tlist.FinishedOpened,
            orderTodo: tlist.OrderTodo
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.UpdateTList = function (tlist, callback) {
        this.Server.TodoLists.update({
            id: tlist.Id,
            name: tlist.Name,
            icon: tlist.Icon,
            unfinishedOpened: tlist.UnfinishedOpened,
            finishedOpened: tlist.FinishedOpened,
            orderTodo: tlist.OrderTodo
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.RemoveTList = function (id, callback) {
        var _this = this;
        this.Server.TodoLists.remove(id).then(function () {
            _this.GetTodosByParentId(id, (function (results) {
                for (var _i = 0, results_2 = results; _i < results_2.length; _i++) {
                    var todo = results_2[_i];
                    _this.RemoveTodo(todo.Id);
                }
                if (callback != undefined)
                    callback();
            }));
        });
    };
    //#endregion TLists
    //#region Todos
    Database.prototype.GetAllTodos = function (callback) {
        this.Server.Todos.query()
            .all()
            .execute()
            .then(function (results) {
            var todos = [];
            for (var _i = 0, results_3 = results; _i < results_3.length; _i++) {
                var item = results_3[_i];
                var todo = new Todo(item.id, item.text, item.parentId, item.done, item.important, item.createDate, item.endDate, item.note);
                todos.push(todo);
            }
            if (callback != undefined)
                callback(todos);
        });
    };
    Database.prototype.GetTodosByParentId = function (id, callback) {
        this.Server.Todos.query()
            .filter("parentId", id)
            .execute()
            .then(function (results) {
            var todos = [];
            for (var _i = 0, results_4 = results; _i < results_4.length; _i++) {
                var item = results_4[_i];
                var todo = new Todo(item.id, item.text, item.parentId, item.done, item.important, item.createDate, item.endDate, item.note);
                todos.push(todo);
            }
            if (callback != undefined)
                callback(todos);
        });
    };
    Database.prototype.AddTodo = function (newText, todoListId, callback) {
        this.Server.Todos.add({
            parentId: todoListId,
            done: false,
            text: newText,
            important: false,
            createDate: new Date().toDateString(),
            endDate: DateMaxValue.toDateString(),
            note: ""
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.AddTodoClass = function (todo, callback) {
        this.Server.Todos.add({
            parentId: todo.ParentId,
            done: todo.Done,
            text: todo.Text,
            important: todo.Important,
            createDate: todo.CreateDate,
            endDate: todo.EndDate,
            note: todo.Note
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.UpdateTodo = function (todo, callback) {
        this.Server.Todos.update({
            id: todo.Id,
            parentId: todo.ParentId,
            done: todo.Done,
            text: todo.Text,
            important: todo.Important,
            createDate: todo.CreateDate,
            endDate: todo.EndDate,
            note: todo.Note
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.RemoveTodo = function (id, callback) {
        var _this = this;
        this.Server.Todos.remove(id).then(function () {
            _this.GetTStepsByParentId(id, (function (results) {
                for (var _i = 0, results_5 = results; _i < results_5.length; _i++) {
                    var step = results_5[_i];
                    _this.RemoveTStep(step.Id);
                }
                if (callback != undefined)
                    callback();
            }));
        });
    };
    Database.prototype.FindTodo = function (text, callback) {
        this.Server.Todos.query()
            .filter(function (todo) { return todo.text.includes(text); })
            .execute()
            .then(function (results) {
            var todos = [];
            for (var _i = 0, results_6 = results; _i < results_6.length; _i++) {
                var item = results_6[_i];
                var todo = new Todo(item.id, item.text, item.parentId, item.done, item.important, item.createDate, item.endDate, item.note);
                todos.push(todo);
            }
            if (callback != undefined)
                callback(todos);
        });
    };
    //#endregion Todos
    //#region TSteps
    Database.prototype.GetAllTSteps = function (callback) {
        this.Server.TodoSteps.query()
            .all()
            .execute()
            .then(function (results) {
            var steps = [];
            for (var _i = 0, results_7 = results; _i < results_7.length; _i++) {
                var item = results_7[_i];
                var step = new TStep(item.id, item.text, item.parentId, item.done);
                steps.push(step);
            }
            if (callback != undefined)
                callback(steps);
        });
    };
    Database.prototype.GetTStepsByParentId = function (id, callback) {
        this.Server.TodoSteps.query()
            .filter("parentId", id)
            .execute()
            .then(function (results) {
            var steps = [];
            for (var _i = 0, results_8 = results; _i < results_8.length; _i++) {
                var item = results_8[_i];
                var step = new TStep(item.id, item.text, item.parentId, item.done);
                steps.push(step);
            }
            if (callback != undefined)
                callback(steps);
        });
    };
    Database.prototype.AddTStep = function (newText, todoId, callback) {
        this.Server.TodoSteps.add({
            parentId: todoId,
            done: false,
            text: newText
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.AddTStepClass = function (step, callback) {
        this.Server.TodoSteps.add({
            parentId: step.ParentId,
            done: step.Done,
            text: step.Text
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.UpdateTStep = function (step, callback) {
        this.Server.TodoSteps.update({
            id: step.Id,
            parentId: step.ParentId,
            done: step.Done,
            text: step.Text
        }).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    Database.prototype.RemoveTStep = function (id, callback) {
        this.Server.TodoSteps.remove(id).then(function () {
            if (callback != undefined)
                callback();
        });
    };
    //#endregion TSteps
    Database.prototype.ImportData = function (json, callback) {
        var _this = this;
        this.Server.TodoLists.clear().then(function () {
            _this.Server.Todos.clear().then(function () {
                _this.Server.TodoSteps.clear().then(function () {
                    var content = JSON.parse(json);
                    if (content.TLists != undefined) {
                        for (var _i = 0, _a = content.TLists; _i < _a.length; _i++) {
                            var item = _a[_i];
                            _this.AddTlistClass(item);
                        }
                    }
                    if (content.TodoList != undefined) {
                        for (var _b = 0, _c = content.TodoList; _b < _c.length; _b++) {
                            var item = _c[_b];
                            _this.AddTodoClass(item);
                        }
                    }
                    if (content.StepList != undefined) {
                        for (var _d = 0, _e = content.StepList; _d < _e.length; _d++) {
                            var item = _e[_d];
                            _this.AddTStepClass(item);
                        }
                    }
                    callback();
                });
            });
        });
    };
    Database.prototype.ExportData = function (callback) {
        var _this = this;
        this.GetAllTLists(function (tlists) {
            _this.GetAllTodos(function (todoList) {
                _this.GetAllTSteps(function (stepList) {
                    var undividedTodos = todoList.filter(function (item) { return item.ParentId == UndividedTListId; });
                    if (tlists.length > 0 || undividedTodos.length > 0)
                        callback(JSON.stringify({ TLists: tlists, TodoList: todoList, StepList: stepList }));
                    else
                        callback("");
                });
            });
        });
    };
    return Database;
}());
//# sourceMappingURL=Database.js.map