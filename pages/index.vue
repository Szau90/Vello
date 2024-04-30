<script setup>
import { useBoardStore } from "~/stores/boardStore";
import {storeToRefs} from 'pinia'

const boardStore = useBoardStore();
const route = useRoute()
const router = useRouter()

const {board} = storeToRefs(boardStore)

const { addColumn } = boardStore;

const addNewColumn = () => {
  addColumn(newColumnName.value);
  newColumnName.value = "";
};

const newColumnName = ref("");

const isModalOpen = computed(() => {
    return route.name === 'index-tasks-id'
})
const closeModal = () => {
    router.push('/')
}



</script>

<template>
  <div class="board-wrapper">
    <main class="board">
      <BoardColumn
        v-for="(column, colIndex) in board.columns"
        :kex="column.id"
        :column="column"
        :colIndex="colIndex"
      />
      <UContainer class="column">
        <UInput
          v-model="newColumnName"
          type="text"
          placeholder="Create a new column"
          icon="i-heroicons-plus-circle-solid"
          @keyup.enter="addNewColumn(newColumnName)"
        />
      </UContainer>
    </main>
    <div v-show="isModalOpen" class="task-bg" @click.self="closeModal()">
        <NuxtPage :key="route.fullPath" />
    </div>
  </div>
</template>
