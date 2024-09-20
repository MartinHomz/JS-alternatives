var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Todo = /** @class */ (function (_super) {
    __extends(Todo, _super);
    function Todo(id, text, parentId, done, important, createDate, endDate, note) {
        if (id === void 0) { id = -1; }
        if (text === void 0) { text = ""; }
        if (parentId === void 0) { parentId = UndividedTListId; }
        if (done === void 0) { done = false; }
        if (important === void 0) { important = false; }
        if (createDate === void 0) { createDate = new Date().toDateString(); }
        if (endDate === void 0) { endDate = DateMaxValue.toDateString(); }
        if (note === void 0) { note = ""; }
        var _this = _super.call(this, id, text, parentId, done) || this;
        _this.Important = important;
        _this.CreateDate = createDate;
        _this.EndDate = endDate;
        _this.Note = note;
        return _this;
    }
    Todo.prototype.Update = function (callback) {
        Database.Current().UpdateTodo(this, callback);
    };
    Todo.prototype.Remove = function (callback) {
        Database.Current().RemoveTodo(this.Id, callback);
    };
    Todo.prototype.GetTodoSteps = function (callback) {
        Database.Current().GetTStepsByParentId(this.Id, callback);
    };
    Todo.prototype.AddStep = function (text, callback) {
        Database.Current().AddTStep(text, this.Id, callback);
    };
    return Todo;
}(TStep));
//# sourceMappingURL=Todo.js.map