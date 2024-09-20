import 'TList.dart';
import 'TStep.dart';
import 'Todo.dart';
import 'dart:js' as js;
import 'dart:html';

const String dbName = 'TodoDB.db';
const String tListStoreName = 'TodoLists';
const String todoStoreName = 'Todos';
const String tStepStoreName = 'TodoSteps';
const int version = 1;
const int UndividedTListId = -1;
String DateMaxValue = DateTime(9999, 11, 31, 23, 59, 59, 999).toString();

class Database {
  static final Database Current = Database._database();

  factory Database() {
    return Current;
  }

  Database._database();

  void InitializeDatabase({callback}) {
    js.context["Database"].callMethod('InitializeDatabase');
    if (callback != null) callback();
  }

  void GetAllTLists({callback}) {
    if (callback != null) callback(List<TList>());
  }

  void AddTlist(String newName, {callback}) {
    if (callback != null) callback();
  }

  void AddTlistClass(TList tList, {callback}) {
    if (callback != null) callback();
  }

  void UpdateTList(TList tList, {callback}) {
    if (callback != null) callback();
  }

  void RemoveTList(int id, {callback}) {
    if (callback != null) callback();
  }

  void GetAllTodos({callback}) {
    if (callback != null) callback(List<Todo>());
  }

  void GetTodosByParentId(int id, {callback}) {
    if (callback != null) callback(List<Todo>());
  }

  void AddTodo(String newText, int todoListId, {callback}) {
    if (callback != null) callback();
  }

  void AddTodoClass(Todo todo, {callback}) {
    if (callback != null) callback();
  }

  void UpdateTodo(Todo todo, {callback}) {
    if (callback != null) callback();
  }

  void RemoveTodo(int id, {callback}) {
    if (callback != null) callback();
  }

  void FindTodo(String text, {callback}) {
    if (callback != null) callback(List<Todo>());
  }

  void GetAllTSteps({callback}) {
    if (callback != null) callback(List<TStep>());
  }

  void GetTStepsByParentId(int id, {callback}) {
    if (callback != null) callback(List<TStep>());
  }

  void AddTStep(String newText, int todoId, {callback}) {
    if (callback != null) callback();
  }

  void AddTStepClass(TStep step, {callback}) {
    if (callback != null) callback();
  }

  void UpdateTStep(TStep step, {callback}) {
    if (callback != null) callback();
  }

  void RemoveTStep(int id, {callback}) {
    if (callback != null) callback();
  }

  void ImportData(String json, {callback}) {
    if (callback != null) callback();
  }

  void ExportData({callback}) {
    if (callback != null) callback();
  }
}
