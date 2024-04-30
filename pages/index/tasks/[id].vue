<script setup>
import { useRouter } from "vue-router";
import { useBoardStore } from "~/stores/boardStore";

const boardStore = useBoardStore();
const route = useRoute();
const router = useRouter();

const toast = useToast()

const { getTask, deleteTask } = boardStore;

const task = computed(() => {
  return getTask(route.params.id);
});

const handleDelete = () => {
  toast.add({
    title: 'Task deleted',
    description: `${task.value.name} has been deleted.`,
    icon: 'i-heroicons-trash',
    color: 'red'
  })
  deleteTask(route.params.id);
  router.push("/");
};
</script>

<template>
  <div class="task-wrapper">
    <div v-if="task" class="task-view">
      <UFormGroup label="Name" class="w-full mb-4">
        <UInput type="text" v-model="task.name" />
      </UFormGroup>
      <UFormGroup label="Description" class="w-full mb-4">
        <UTextarea v-model="task.description" />
      </UFormGroup>
      <UButton @click="handleDelete" icon="i-heroicons-trash" color="red"
        >Delete Task</UButton
      >
    </div>
    <div v-else>
      <p>task not found</p>
    </div>
  </div>
</template>
