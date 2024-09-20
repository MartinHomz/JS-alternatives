import 'Database.dart';
import 'Todo.dart';

enum eOrderTodo { None, Important, EndDate, Alphabet, CreateDate }

Function DefaultGetTodos = (TList tlist, Function callback) {
  Database.Current.GetTodosByParentId(tlist.Id, callback: (todos) {
    callback(todos);
  });
};

Function DefaultAddTodo = (String text, TList tlist, Function callback) {
  Database.Current.AddTodo(text, tlist.Id, callback: callback);
};

class TList {
  int Id;
  String Name;
  String Icon;
  bool UnfinishedOpened;
  bool FinishedOpened;
  eOrderTodo OrderTodo;
  Function GetTodos;
  Function AddTodo;

  TList(
      {int id = -1,
      String name = '',
      String icon = '',
      bool unfinishedOpened = false,
      bool finishedOpened = false,
      eOrderTodo orderTodo = eOrderTodo.None}) {
    Id = id;
    Name = name;
    Icon = icon;
    UnfinishedOpened = unfinishedOpened;
    FinishedOpened = finishedOpened;
    OrderTodo = orderTodo;
    GetTodos = DefaultGetTodos;
    AddTodo = DefaultAddTodo;
  }

  void Update(callback) {
    //Database.Current().UpdateTList(this, callback);
  }

  void Remove(callback) {
    //Database.Current().RemoveTList(this, callback);
  }

  Map<String, String> toMap() {
    var map = <String, String>{
      'name': Name,
      'icon': Icon,
      'unfinishedOpened': UnfinishedOpened.toString(),
      'finishedOpened': FinishedOpened.toString(),
      'orderTodo': OrderTodo.toString(),
    };
    return map;
  }

  TList.fromMap(Map map, this.Id) {
    Name = map['name'];
    Icon = map['icon'];
    UnfinishedOpened = map['unfinishedOpened'];
    FinishedOpened = map['finishedOpened'];
    OrderTodo = map['orderTodo'];
  }

  void GetTodosByOrder(Function callback) {
    var orderTodo = OrderTodo;
    GetTodos(this, (todos) {
      switch (orderTodo) {
        case eOrderTodo.Important:
          callback(todos.sort((Todo a, Todo b) =>
              (b.Important ? 1 : 0) - (a.Important ? 1 : 0)));
          break;
        case eOrderTodo.EndDate:
          callback(todos.sort((Todo a, Todo b) =>
              DateTime.parse(a.EndDate).compareTo(DateTime.parse(b.EndDate))));
          break;
        case eOrderTodo.Alphabet:
          callback(todos.sort((Todo a, Todo b) =>
              a.Text.toLowerCase().compareTo(b.Text.toLowerCase())));
          break;
        case eOrderTodo.CreateDate:
          callback(todos.sort((Todo a, Todo b) => DateTime.parse(a.CreateDate)
              .compareTo(DateTime.parse(b.CreateDate))));
          break;
        default:
          callback(todos);
          break;
      }
    });
  }

  void GetUnfinishedTodosCount(Function callback) {
    GetTodos(this, (todos) {
      int count = todos.filter((Todo todo) => !todo.Done).length;
      callback(count > 0 ? count : '');
    });
  }
}
