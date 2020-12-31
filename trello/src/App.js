import React, { useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./App.css";
import { getRandomId, getIndexById, createItemFromTitle } from "./utils";

function App() {
  const [boards, setBoards] = React.useState([
    {
      id: 1,
      title: "Сделать",
      items: [
        { id: 1, title: "Купить хлеб" },
        { id: 2, title: "Купить воду" },
        { id: 3, title: "Выкинуть мусор" },
      ],
    },
    {
      id: 2,
      title: "Проверить",
      items: [
        { id: 1, title: "код ревью" },
        { id: 2, title: "Задачи" },
        { id: 3, title: "Д/З" },
      ],
    },
    {
      id: 3,
      title: "Сделано",
      items: [
        { id: 1, title: "Купить муки" },
        { id: 2, title: "Прибраться" },
        { id: 3, title: "Посмотреть видео о GraphQl" },
      ],
    },
  ]);

  const counterDragEvent = useRef(0);
  const lastActiveBoardEnter = useRef(null);
  const lastAction = useRef(null); // leave or enter
  const activeItem = useRef(null);

  const isNotMouseOnItem = (
    checkedId,
    checkedBoard,
    onMouseId,
    onMouseBoard
  ) => {
    return checkedId !== onMouseId || checkedBoard !== onMouseBoard;
  };
  const getBoard = React.useCallback((target) => target.closest(".board"), []);

  const removeClassFromItem = React.useCallback(
    ({ target, classRemove }) => target.classList.remove(classRemove),
    []
  );
  const makeDefaultStart = (e, isStopPropagation) => {
    e.preventDefault();
    isStopPropagation && e.stopPropagation();
    return e.target;
  };

  const handleDragStart = (e, item) => {
    e.stopPropagation();
    if (!item) {
      e.preventDefault();
    } else {
      activeItem.current = item;
    }
  };

  const handleDragEnter = (e, item) => {
    const target = makeDefaultStart(e, true);
    const board = getBoard(target);
    counterDragEvent.current += 1;
    lastAction.current = "enter";
    lastActiveBoardEnter.current = board;
    counterDragEvent.current && board.classList.add("drag");
    if (target.classList.contains("item")) {
      if (
        isNotMouseOnItem(
          activeItem.current.id,
          activeItem.current.boardId,
          item.id,
          item.boardId
        )
      ) {
        target.classList.add("active");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    const target = e.target;
    const board = getBoard(target);
    if (
      ((lastAction.current === "leave" && counterDragEvent.current === 1) ||
        (lastAction.current === "enter" && counterDragEvent.current === 2)) &&
      lastActiveBoardEnter.current !== board
    ) {
      // чтобы если быстро курсор перемещать активный класс не зависал, а удалялся
      removeClassFromItem({ target: board, classRemove: "drag" });
    }
    counterDragEvent.current -= 1;
    !counterDragEvent.current &&
      removeClassFromItem({ target: board, classRemove: "drag" });

    lastAction.current = "leave";
    removeClassFromItem({ target, classRemove: "active" });
  };

  const handleDragEnd = (e) => {
    activeItem.current = null;
  };

  const handleDrop = (e, droppedBoard, droppedItem) => {
    const target = makeDefaultStart(e, true);
    const closestBoard = getBoard(target);
    const {
      id: currentId,
      title: currentTitle,
      boardId: currentBoardId,
    } = activeItem.current;
    counterDragEvent.current -= 1;
    removeClassFromItem({ target: closestBoard, classRemove: "drag" });
    removeClassFromItem({ target, classRemove: "active" });
    if (!target.classList.contains("item")) {
      setBoards(
        boards.map((board) => {
          const fakeBoard = { ...board };
          if (fakeBoard.id === droppedBoard.id) {
            fakeBoard.items.push(createItemFromTitle(currentTitle));
          }
          if (fakeBoard.id === currentBoardId) {
            fakeBoard.items.splice(getIndexById(fakeBoard.items, currentId), 1);
          }
          return fakeBoard;
        })
      );
    } else if (
      isNotMouseOnItem(
        currentId,
        currentBoardId,
        droppedItem.id,
        droppedBoard.id
      )
    ) {
      setBoards(
        boards.map((board) => {
          const fakeBoard = { ...board };
          if (fakeBoard.id === droppedBoard.id) {
            fakeBoard.items.splice(
              getIndexById(fakeBoard.items, droppedItem.id) + 1,
              0,
              createItemFromTitle(currentTitle)
            );
          }
          if (fakeBoard.id === currentBoardId) {
            fakeBoard.items.splice(getIndexById(fakeBoard.items, currentId), 1);
          }
          return fakeBoard;
        })
      );
    }
  };

  return (
    <div className="app">
      {boards.map((board) => (
        <div
          className="board"
          key={board.id}
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, board)}
        >
          <div className="board__title">{board.title}</div>
          <TransitionGroup component={null}>
            {board.items.map((item) => (
              <CSSTransition
                key={item.id}
                timeout={500}
                classNames={{
                  enterActive: "item-fade-in",
                  exitActive: "item-fade-out",
                }}
              >
                <div
                  draggable={true}
                  className="item"
                  onDragStart={(e) =>
                    handleDragStart(e, { ...item, boardId: board.id })
                  }
                  onDragEnter={(e) =>
                    handleDragEnter(e, { ...item, boardId: board.id })
                  }
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, board, item)}
                >
                  {item.title}
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      ))}
    </div>
  );
}

export default App;
