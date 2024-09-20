import 'Database.dart';

class TStep {
  int Id;
  String Text;
  int ParentId;
  bool Done;

  TStep(
      {int id = -1,
      String text = '',
      int parentId = UndividedTListId,
      bool done = false}) {
    Id = id;
    Text = text;
    ParentId = parentId;
    Done = done;
  }

  void Update(Function callback) {
    Database.Current.UpdateTStep(this, callback: callback);
  }

  void Remove(Function callback) {
    Database.Current.RemoveTStep(Id, callback: callback);
  }
}
