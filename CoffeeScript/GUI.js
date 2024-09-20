(function() {
  var GUI;

  window.SidebarState = {
    Opened: 0,
    Closed: 1
  };

  window.DialogContent = {
    Text: 0,
    Settings: 1,
    TListSettings: 2
  };

  GUI = (function() {
    var PrivateClass, gui;

    class GUI {
      static Current() {
        return gui != null ? gui : gui = new PrivateClass();
      }

    };

    gui = null;

    PrivateClass = (function() {
      class PrivateClass {
        Initialize() {
          gui.SetColorMode();
          return gui.BaseInitialize();
        }

        BaseInitialize() {
          $("#btnHideLeftSidebar").click(function() {
            return gui.ToggleLeftSidebar();
          });
          $("#btnLeftSidebarSettings").click(function() {
            return gui.ShowSettingsDialog();
          });
          $("#fileLeftSidebarImport").change(function() {
            return window.State.ImportData(this);
          });
          $("#btnLeftSidebarExport").click(function() {
            return window.State.ExportData();
          });
          $("#btnLeftSidebarSearch").click(function() {
            return window.State.ShowSearchView();
          });
          $("#txtNewTListText").keyup(function(e) {
            return window.State.AddNewTListTextKeyUp(e);
          });
          $("#btnAddNewTList").click(function() {
            return window.State.AddNewTList();
          });
          if (gui.LeftSidebarStatus === window.SidebarState.Closed) {
            $("#LeftSidebar").addClass("is-hidden");
          }
          if (gui.RightSidebarStatus === window.SidebarState.Closed) {
            $("#RightSidebar").addClass("is-hidden");
          }
          $("#txtRightSidebarTodoText").change(function() {
            return window.State.TodoTextChanged(this);
          });
          $("#btnAddNewTStep").click(function() {
            return window.State.AddTStep();
          });
          $("#txtNewTStepText").keyup(function(e) {
            return window.State.AddNewTStepTextKeyUp(e);
          });
          $("#dtpRightSidebarTodoEndDate").change(function() {
            return window.State.TodoEndDateChanged(this);
          });
          $("#txaRightSidebarTodoNote").change(function() {
            return window.State.TodoNoteChanged(this);
          });
          $("#btnHideRightSidebar").click(function() {
            return window.State.HideRightSidebar();
          });
          $("#btnDeleteTodo").click(function() {
            return window.State.RemoveTodo();
          });
          $("#btnToggleLeftSidebar").click(function() {
            return gui.ToggleLeftSidebar();
          });
          $("#txtHeaderTListName").change(function() {
            return window.State.TListNameChange(this);
          });
          $("#btnDeleteTList").click(function() {
            return window.State.RemoveTList();
          });
          $("#btnSettingsTList").click(function() {
            return gui.ShowTListSettingsDialog();
          });
          $("#txtSearchText").on("input", function() {
            return window.State.Search();
          });
          $("#Main").click(function() {
            return gui.OutsideClick();
          });
          $(window).resize(function() {
            return gui.GetContentCoverStyle();
          });
          $("#btnAddNewTodo").click(function() {
            return window.State.AddTodo();
          });
          $("#txtNewTodoText").keyup(function(e) {
            return window.State.AddNewTodoTextKeyUp(e);
          });
          $("#btnHideDialog").click(function() {
            return gui.HideDialog();
          });
          $("#slbIcon").change(function() {
            return window.State.TListIconChange(this);
          });
          $("#slbOrderTodo").change(function() {
            return window.State.TListOrderTodoChange(this);
          });
          $("#chbDarkMode").change(function() {
            return window.State.SetColorMode(this);
          });
          gui.HideSearchView();
          $("#chbRightSidebarTodoDone").click(function() {
            return window.State.TodoDoneChanged(window.State.CurrentTodo.Id);
          });
          return $("#btnRightSidebarTodoImportant").click(function() {
            return window.State.TodoImportantChanged(window.State.CurrentTodo.Id);
          });
        }

        DrawTLists() {
          var i, item, len, ref, results;
          $('#NavigationBaseTLists').empty();
          $('#NavigationUserTLists').empty();
          gui.CreateTList(window.State.TodayTodos, "lstTodayTodos", "NavigationBaseTLists");
          gui.CreateTList(window.State.ImportantTodos, "lstImportantTodos", "NavigationBaseTLists");
          gui.CreateTList(window.State.PlannedTodos, "lstPlannedTodos", "NavigationBaseTLists");
          gui.CreateTList(window.State.UndividedTodos, "lstUndividedTodos", "NavigationBaseTLists");
          ref = window.State.TLists;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            results.push(gui.CreateTList(item, `lstItem${item.Id}`, "NavigationUserTLists"));
          }
          return results;
        }

        CreateTList(tList, lstId, container) {
          return tList.GetUnfinishedTodosCount(function(result) {
            var markup;
            markup = $(`<li id='${lstId}' class='LeftSidebar-item ${(window.State.CurrentTList === tList ? "is-selected" : void 0)}'> <span class='LeftSidebar-itemIcon ${tList.Icon}'></span> <span class='LeftSidebar-itemText'>${tList.Name}</span> <span class='LeftSidebar-itemCount'>${result}</span> </li>`);
            markup.appendTo(`#${container}`);
            return $(`#${lstId}`).click(function() {
              return window.State.SwitchTList(tList);
            });
          });
        }

        SetRightSidebar() {
          var endDate;
          $("#chbRightSidebarTodoDone").prop("checked", window.State.CurrentTodo.Done);
          $("#txtRightSidebarTodoText").val(window.State.CurrentTodo.Text);
          gui.SetRightSidebarTodoImportant(window.State.CurrentTodo.Important);
          endDate = new Date(window.State.CurrentTodo.EndDate);
          $("#dtpRightSidebarTodoEndDate").val(window.State.CurrentTodo.EndDate !== window.DateMaxValue.toDateString() ? `${gui.formatDate(endDate)}` : "");
          $("#txaRightSidebarTodoNote").val(window.State.CurrentTodo.Note);
          return $("#lblRightSidebarTodoCreateDate").text(window.State.CurrentTodo.CreateDate);
        }

        formatDate(date) {
          var d, day, month, year;
          d = new Date(date);
          month = '' + (d.getMonth() + 1);
          day = '' + d.getDate();
          year = d.getFullYear();
          if (month.length < 2) {
            month = '0' + month;
          }
          if (day.length < 2) {
            day = '0' + day;
          }
          return [year, month, day].join('-');
        }

        DrawMain() {
          $('#TodoDividerContainer').empty();
          if (gui.SearchView) {
            return gui.CreateTodoDivider("dvcSearched", "Vyhledáno", true, window.State.UnfinishedTodos, true);
          } else {
            gui.SetHeader();
            gui.CreateTodoDivider("dvcUnfinished", "Nedokončeno", window.State.CurrentTList.UnfinishedOpened, window.State.UnfinishedTodos, true);
            return gui.CreateTodoDivider("dvcFinished", "Dokončeno", window.State.CurrentTList.FinishedOpened, window.State.FinishedTodos, false);
          }
        }

        CreateTodoDivider(id, text, opened, todos, unfinishedButton) {
          var dividerContainer, i, len, markup, results, todo;
          dividerContainer = `${id}TodoContainer`;
          markup = $(`<div id='${id}' class='TaskDivider'> <span class='TaskDivider-button ${(opened ? "bi bi-chevron-down" : "bi bi-chevron-right")}'></span> <span>${text}</span> <span>${(todos !== void 0 && todos.length > 0 ? todos.length : "")}</span> </div> <div id='${dividerContainer}'></div>`);
          markup.appendTo("#TodoDividerContainer");
          $(`#${id}`).click(function() {
            return window.State.TodoDividerClick(unfinishedButton);
          });
          if (todos !== void 0 && opened) {
            results = [];
            for (i = 0, len = todos.length; i < len; i++) {
              todo = todos[i];
              results.push(gui.CreateTodo(todo, dividerContainer));
            }
            return results;
          }
        }

        CreateTodo(todo, container) {
          var markup;
          markup = $(`<div class='TaskBlock ${(window.State.CurrentTodo === todo ? "is-selected" : "")}'> <div class='TaskBlock-check'> <div class='CheckboxContainer'> <div class='Round'> <input id='chbTaskDone${todo.Id}' ${(todo.Done === true ? "checked" : void 0)} type='checkbox' /> <label for='chbTaskDone${todo.Id}'></label> </div> </div> </div> <span id='lblTaskText${todo.Id}' class='TaskBlock-text'>${todo.Text}</span> <span id='lblTaskImportant${todo.Id}' class='TaskBlock-important ${(todo.Important ? "is-checked" : "")}'> <i class='TaskBlock-importantIcon bi-star-fill'></i> </span> </div>`);
          markup.appendTo(`#${container}`);
          $(`#chbTaskDone${todo.Id}`).click(function() {
            return window.State.TodoDoneChanged(todo.Id);
          });
          $(`#lblTaskText${todo.Id}`).click(function() {
            return window.State.TodoSelected(todo.Id);
          });
          return $(`#lblTaskImportant${todo.Id}`).click(function() {
            return window.State.TodoImportantChanged(todo.Id);
          });
        }

        DrawTSteps() {
          var i, len, ref, results, step;
          $('#TStepContainer').empty();
          ref = window.State.TSteps;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            step = ref[i];
            results.push(gui.CreateTStep(step));
          }
          return results;
        }

        CreateTStep(step) {
          var markup;
          markup = $(`<div class='RightSidebar-step'> <div class='RightSidebar-taskCheck'> <div class='CheckboxContainer'> <div class='Round'> <input id='chbStepDone${step.Id}' ${(step.Done === true ? "checked" : void 0)} type='checkbox' /> <label for='chbStepDone${step.Id}'></label> </div> </div> </div> <span class='RightSidebar-taskText TextBox'> <input id='txtStepText${step.Id}' class='TextBox-input' value='${step.Text}' type='text' /> </span> <button id='btnStepImportant${step.Id}' class='Button RightSidebar-taskDelete' title='Smazat krok'> <i class='bi bi-trash'></i> </button> </div>`);
          markup.appendTo("#TStepContainer");
          $(`#chbStepDone${step.Id}`).click(function() {
            return window.State.TStepCheckedChanged(step.Id);
          });
          $(`#txtStepText${step.Id}`).change(function() {
            return window.State.TStepTextChanged(this, step.Id);
          });
          return $(`#btnStepImportant${step.Id}`).click(function() {
            return window.State.RemoveTStep(step.Id);
          });
        }

        SetHeader() {
          $("#lblHeaderTListIcon").removeAttr('class');
          $("#lblHeaderTListIcon").addClass(window.State.CurrentTList.Icon);
          if (gui.SearchView) {
            gui.ShowSearchView();
          } else {
            gui.HideSearchView();
          }
          $("#txtHeaderTListName").prop("readonly", window.State.CurrentTList.Id === window.UndividedTListId);
          $("#txtHeaderTListName").val(window.State.CurrentTList.Name);
          if (window.State.CurrentTList.Id !== window.UndividedTListId) {
            $("#TListControls").removeClass("u-d-none");
          } else {
            $("#TListControls").addClass("u-d-none");
          }
          return $("#txtSearchText").val("");
        }

        SetColorMode() {
          if (window.Settings.GetDarkMode() === "true") {
            if ($("#Page").hasClass("LightMode")) {
              $("#Page").removeClass("LightMode");
            }
            return $("#Page").addClass("DarkMode");
          } else {
            if ($("#Page").hasClass("DarkMode")) {
              $("#Page").removeClass("DarkMode");
            }
            return $("#Page").addClass("LightMode");
          }
        }

        GetContentCoverStyle() {
          if (gui.IsSmallScreen() && (gui.LeftSidebarStatus === window.SidebarState.Opened || gui.RightSidebarStatus === window.SidebarState.Opened)) {
            return $("#MainCover").addClass("Main-coverContent");
          } else {
            return $("#MainCover").removeClass("Main-coverContent");
          }
        }

        SetRightSidebarTodoImportant(todo) {
          if (todo.Important) {
            return $("#btnRightSidebarTodoImportant").addClass("is-checked");
          } else {
            return $("#btnRightSidebarTodoImportant").removeClass("is-checked");
          }
        }

        OutsideClick() {
          if (gui.IsSmallScreen()) {
            $("#LeftSidebar").addClass("is-hidden");
            gui.LeftSidebarStatus = window.SidebarState.Closed;
            return gui.GetContentCoverStyle();
          }
        }

        ToggleLeftSidebar() {
          gui.LeftSidebarStatus = gui.ToggleSidebar(gui.LeftSidebarStatus, "#LeftSidebar");
          return gui.GetContentCoverStyle();
        }

        ToggleRightSidebar() {
          gui.RightSidebarStatus = gui.ToggleSidebar(gui.RightSidebarStatus, "#RightSidebar");
          return gui.GetContentCoverStyle();
        }

        ToggleSidebar(sidebarStatus, id) {
          switch (sidebarStatus) {
            case window.SidebarState.Closed:
              $(id).removeClass("is-hidden");
              return window.SidebarState.Opened;
            default:
              $(id).addClass("is-hidden");
              return window.SidebarState.Closed;
          }
        }

        IsSmallScreen() {
          return $("#Page").innerWidth() < 992;
        }

        DownloadFile(fileBase64) {
          return fetch(`data:application/json;base64,${fileBase64}`).then(function(response) {
            return response.blob();
          }).then(function(blob) {
            var link;
            link = window.document.createElement("a");
            link.href = window.URL.createObjectURL(blob, {
              type: "application/json"
            });
            link.download = "TodoExport.json";
            document.body.appendChild(link);
            link.click();
            return document.body.removeChild(link);
          });
        }

        ShowSearchView() {
          $("#lblHeaderTListIcon").addClass("u-d-none");
          $("#txtHeaderTListName").addClass("u-d-none");
          $("#TListControls").addClass("u-d-none");
          $("#SearchViewEditor").removeClass("u-d-none");
          $("#AddTodoContainer").addClass("u-d-none");
          $("#txtSearchText").val("");
          return gui.SearchView = true;
        }

        HideSearchView() {
          $("#lblHeaderTListIcon").removeClass("u-d-none");
          $("#txtHeaderTListName").removeClass("u-d-none");
          $("#TListControls").removeClass("u-d-none");
          $("#SearchViewEditor").addClass("u-d-none");
          $("#AddTodoContainer").removeClass("u-d-none");
          return gui.SearchView = false;
        }

        GetSearchText() {
          return $("#txtSearchText").val();
        }

        ClearNewTListName() {
          return $("#txtNewTListText").val("");
        }

        GetNewTListName() {
          return $("#txtNewTListText").val();
        }

        ClearNewTodoText() {
          return $("#txtNewTodoText").val("");
        }

        GetNewTodoText() {
          return $("#txtNewTodoText").val();
        }

        ClearNewTStepText() {
          return $("#txtNewTStepText").val("");
        }

        GetNewTStepText() {
          return $("#txtNewTStepText").val();
        }

        ShowTextDialog(title, text) {
          gui.DialogContent = window.DialogContent.Text;
          $("#lblDialogHead").text(title);
          $("#DialogTextContainer").text(text);
          return gui.ShowDialog();
        }

        ShowSettingsDialog() {
          gui.DialogContent = window.DialogContent.Settings;
          $("#lblDialogHead").text("Nastavení");
          return gui.ShowDialog();
        }

        ShowTListSettingsDialog() {
          gui.DialogContent = window.DialogContent.TListSettings;
          $("#lblDialogHead").text("Nastavení seznamu: " + window.State.CurrentTList.Name);
          return gui.ShowDialog();
        }

        ShowDialog() {
          switch (gui.DialogContent) {
            case window.DialogContent.Settings:
              $("#DialogTextContainer").addClass("u-d-none");
              $("#DialogSettingsContainer").removeClass("u-d-none");
              $("#DialogTListSettingsContainer").addClass("u-d-none");
              $("#chbDarkMode").prop("checked", window.Settings.GetDarkMode() === "true");
              break;
            case window.DialogContent.TListSettings:
              $("#DialogTextContainer").addClass("u-d-none");
              $("#DialogSettingsContainer").addClass("u-d-none");
              $("#DialogTListSettingsContainer").removeClass("u-d-none");
              $("#slbOrderTodo").val(window.State.CurrentTList.OrderTodo);
              $("#slbIcon").val(window.State.CurrentTList.Icon);
              break;
            default:
              $("#DialogTextContainer").removeClass("u-d-none");
              $("#DialogSettingsContainer").addClass("u-d-none");
              $("#DialogTListSettingsContainer").addClass("u-d-none");
          }
          return $("#Dialog").addClass("is-showed");
        }

        HideDialog() {
          return $("#Dialog").removeClass("is-showed");
        }

      };

      PrivateClass.prototype.SearchView = false;

      PrivateClass.prototype.LeftSidebarStatus = window.SidebarState.Closed;

      PrivateClass.prototype.RightSidebarStatus = window.SidebarState.Closed;

      PrivateClass.prototype.DialogContent = window.DialogContent.Text;

      return PrivateClass;

    }).call(this);

    return GUI;

  }).call(this);

  window.GUI = GUI.Current();

}).call(this);


//# sourceMappingURL=GUI.js.map
//# sourceURL=coffeescript