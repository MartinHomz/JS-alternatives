(function() {
  window.TStep = class TStep {
    constructor(Id = -1, Text = "", ParentId = window.UndividedTListId, Done = false) {
      this.Id = Id;
      this.Text = Text;
      this.ParentId = ParentId;
      this.Done = Done;
    }

    Update(callback) {
      return window.Database.UpdateTStep(this, callback);
    }

    Remove(callback) {
      return window.Database.RemoveTStep(this.Id, callback);
    }

  };

}).call(this);


//# sourceMappingURL=TStep.js.map
//# sourceURL=coffeescript