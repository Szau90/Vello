<script setup>
import { useBoardStore } from "~/stores/boardStore";

const router = useRouter();

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
  colIndex: {
    type: Number,
    required: true,
  },
});

const boardStore = useBoardStore();

const { deleteColumn, addTask, moveTask, moveColumn } = boardStore;

const editNameState = ref(false);
const newTaskName = ref("");

const handleEdit = () => {
  editNameState.value = !editNameState.value;
};

const handleDelete = (colIndex) => {
  deleteColumn(colIndex);
};

const goToTask = (taskId) => {
  router.push(`/tasks/${taskId}`);
};

const addNewTask = () => {
  addTask({
    taskName: newTaskName.value,
    colIndex: props.colIndex,
  });
  newTaskName.value = "";
};

const pickUpTask = (event, { fromColumnIndex, fromTaskIndex }) => {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.setData("type", "task");
  event.dataTransfer.setData("from-col-index", fromColumnIndex);
  event.dataTransfer.setData("from-task-index", fromTaskIndex);
};

const dropItem = (event, {toColumnIndex, toTaskIndex}) => {
  const type = event.dataTransfer.getData("type");
  const fromColumnIndex = event.dataTransfer.getData("from-col-index");

  if (type === "task") {
    const fromTaskIndex = event.dataTransfer.getData("from-task-index");

    moveTask({
      fromTaskIndex,
      toTaskIndex,
      fromColumnIndex,
      toColumnIndex,
    });
  } else if (type === "column") {
    moveColumn({
      fromColumnIndex,
      toColumnIndex,
    });
  }
};

const pickUpColumn = (event, fromColumnIndex) => {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.setData("type", "column");
  event.dataTransfer.setData("from-col-index", fromColumnIndex);
};
</script>

<template>
  <UContainer
    class="column"
    draggable="true"
    @dragstart.self="pickUpColumn($event, props.colIndex)"
    @dragenter.prevent
    @dragover.prevent
    @drop.stop="dropItem($event, {toColumnIndex: props.colIndex})"
  >
    <div class="column-header mb-4">
      <div>
        <UInput v-if="editNameState" type="text" v-model="column.name" />
        <h2 v-else class="mb-2">{{ column.name }}</h2>
      </div>
      <div>
        <UButton
          @click="handleEdit"
          icon="i-heroicons-pencil-square"
          class="mr-2"
        />
        <UButton
          @click="handleDelete(colIndex)"
          icon="i-heroicons-trash"
          color="red"
        />
      </div>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard
          class="mb-2"
          @click="goToTask(task.id)"
          draggable="true"
          @dragstart="
            pickUpTask($event, {
              fromColumnIndex: props.colIndex,
              fromTaskIndex: taskIndex,
            })
          "
          @drop.stop="
            dropItem($event, {
              toColumnIndex: props.colIndex,
              toTaskIndex: taskIndex,
            })
          "
        >
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>
    <UInput
      v-model="newTaskName"
      type="text"
      placeholder="Create a new task"
      icon="i-heroicons-plus-circle-solid"
      @keyup.enter="addNewTask"
    />
  </UContainer>
</template>
