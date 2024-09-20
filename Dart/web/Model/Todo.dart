import 'TStep.dart';
import 'Database.dart';

class Todo extends TStep {
  bool Important;
  String CreateDate;
  String EndDate;
  String Note;

  Todo(
      {int id = -1,
      String text = '',
      int parentId = UndividedTListId,
      bool done = false,
      bool important = false,
      String createDate = '',
      String endDate = '',
      String note = ''}) {
    Id = id;
    Text = text;
    ParentId = parentId;
    Done = done;
    Important = important;
    if (createDate.isNotEmpty) {
      CreateDate = createDate;
    } else {
      CreateDate = DateTime.now().toString();
    }

    if (endDate.isNotEmpty) {
      EndDate = endDate;
    } else {
      EndDate = DateMaxValue;
    }
  }

  @override
  void Update(Function callback) {
    Database.Current.UpdateTodo(this, callback: callback);
  }

  @override
  void Remove(Function callback) {
    Database.Current.RemoveTodo(Id, callback: callback);
  }

  void GetTodoSteps(Function callback) {
    Database.Current.GetTStepsByParentId(Id, callback: callback);
  }

  void AddStep(String text, Function callback) {
    Database.Current.AddTStep(text, Id, callback: callback);
  }
}
