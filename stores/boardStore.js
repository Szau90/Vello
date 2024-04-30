import { v4 as uuid } from "uuid";
import { defineStore } from "pinia";
import boardData from "~/data/board.json";
import { useStorage } from "@vueuse/core";

export const useBoardStore = defineStore("boardStore", () => {
  const board = useStorage("board", boardData);

  const addColumn = (columnName) => {
    board.value.columns.push({
      name: columnName,
      tasks: [],
    });
  };

  const deleteColumn = (colIndex) => {
    board.value.columns.splice(colIndex, 1);
  };

  const getTask = computed(() => {
    return (taskId) => {
      for (const column of board.value.columns) {
        const task = column.tasks.find((task) => task.id === taskId);

        if (task) return task;
      }
    };
  });

  const addTask = ({ colIndex, taskName }) => {
    board.value.columns[colIndex].tasks.push({
      id: uuid(),
      name: taskName,
      description: "",
    });
  };

  const deleteTask = (taskId) => {
    for (const column of board.value.columns) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);

      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        return;
      }
    }
  };

  const moveTask = ({ fromTaskIndex, toTaskIndex, fromColumnIndex, toColumnIndex }) => {
    const task = board.value.columns[fromColumnIndex].tasks.splice(fromTaskIndex, 1)[0]

    board.value.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task)
  };

  const moveColumn = ({fromColumnIndex, toColumnIndex}) => {
    const column = board.value.columns.splice(fromColumnIndex,1)[0]

    board.value.columns.splice(toColumnIndex, 0, column)
  }

  return {
    board,
    getTask,
    addColumn,
    deleteColumn,
    addTask,
    deleteTask,
    moveTask,
    moveColumn
  };
});
