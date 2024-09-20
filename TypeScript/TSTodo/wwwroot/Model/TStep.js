var TStep = /** @class */ (function () {
    function TStep(id, text, parentId, done) {
        if (id === void 0) { id = -1; }
        if (text === void 0) { text = ""; }
        if (parentId === void 0) { parentId = UndividedTListId; }
        if (done === void 0) { done = false; }
        this.Id = id;
        this.Text = text;
        this.ParentId = parentId;
        this.Done = done;
    }
    TStep.prototype.Update = function (callback) {
        Database.Current().UpdateTStep(this, callback);
    };
    TStep.prototype.Remove = function (callback) {
        Database.Current().RemoveTStep(this.Id, callback);
    };
    return TStep;
}());
//# sourceMappingURL=TStep.js.map