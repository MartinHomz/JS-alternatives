var OrderTodo;
(function (OrderTodo) {
    OrderTodo[OrderTodo["None"] = 0] = "None";
    OrderTodo[OrderTodo["Important"] = 1] = "Important";
    OrderTodo[OrderTodo["EndDate"] = 2] = "EndDate";
    OrderTodo[OrderTodo["Alphabet"] = 3] = "Alphabet";
    OrderTodo[OrderTodo["CreateDate"] = 4] = "CreateDate";
})(OrderTodo || (OrderTodo = {}));
var DefaultGetTodos = function (tlist, callback) {
    Database.Current().GetTodosByParentId(tlist.Id, function (todos) {
        callback(todos);
    });
};
var DefaultAddTodo = function (text, tlist, callback) {
    Database.Current().AddTodo(text, tlist.Id, callback);
};
var TList = /** @class */ (function () {
    function TList(id, name, icon, unfinishedOpened, finishedOpened, orderTodo, getTodos, addTodo) {
        if (id === void 0) { id = -1; }
        if (name === void 0) { name = ""; }
        if (icon === void 0) { icon = ""; }
        if (unfinishedOpened === void 0) { unfinishedOpened = true; }
        if (finishedOpened === void 0) { finishedOpened = false; }
        if (orderTodo === void 0) { orderTodo = OrderTodo.None; }
        if (getTodos === void 0) { getTodos = DefaultGetTodos; }
        if (addTodo === void 0) { addTodo = DefaultAddTodo; }
        this.Id = id;
        this.Name = name;
        this.Icon = icon;
        this.UnfinishedOpened = unfinishedOpened;
        this.FinishedOpened = finishedOpened;
        this.OrderTodo = orderTodo;
        this.GetTodos = getTodos;
        this.AddTodo = addTodo;
    }
    TList.prototype.Update = function (callback) {
        Database.Current().UpdateTList(this, callback);
    };
    TList.prototype.Remove = function (callback) {
        Database.Current().RemoveTList(this.Id, callback);
    };
    TList.prototype.GetTodosByOrder = function (callback) {
        var orderTodo = this.OrderTodo;
        this.GetTodos(this, function (todos) {
            switch (orderTodo) {
                case OrderTodo.Important:
                    callback(todos.sort(function (a, b) { return b.Important - a.Important; }));
                    break;
                case OrderTodo.EndDate:
                    callback(todos.sort(function (a, b) { return new Date(a.EndDate).getTime() - new Date(b.EndDate).getTime(); }));
                    break;
                case OrderTodo.Alphabet:
                    callback(todos.sort(function (a, b) {
                        var textA = a.Text.toUpperCase();
                        var textB = b.Text.toUpperCase();
                        if (textA < textB)
                            return -1;
                        else if (textA > textB)
                            return 1;
                        else
                            return 0;
                    }));
                    break;
                case OrderTodo.CreateDate:
                    callback(todos.sort(function (a, b) { return new Date(a.CreateDate).getTime() - new Date(b.CreateDate).getTime(); }));
                    break;
                default:
                    callback(todos);
                    break;
            }
        });
    };
    TList.prototype.GetUnfinishedTodosCount = function (callback) {
        this.GetTodos(this, function (todos) {
            var count = todos.filter(function (todo) { return !todo.Done; }).length;
            callback(count > 0 ? count : "");
        });
    };
    return TList;
}());
//# sourceMappingURL=TList.js.map