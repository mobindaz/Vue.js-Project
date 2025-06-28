<script setup>
import { ref, computed, watch, nextTick } from "vue";

const task = ref("");
const todos = ref([]);
const filterType = ref("all");
const deleteDialog = ref(false);
const todoToDelete = ref(null);
const taskError = ref("");
const snackbar = ref(false);
const snackbarText = ref("");
const isTruncatedMap = ref({});

const onAddTodos = () => {
  if (task.value.trim()) {
    todos.value.push({ text: task.value.trim(), completed: false });
    task.value = "";
    filterType.value = "all";
  }
};

const markComplete = (todo) => {
  if (!todo.completed) {
    todo.completed = true;
    showSnackbar(`Completed: "${todo.text}"`);
  }
};

const openDeleteDialog = (todo) => {
  todoToDelete.value = todo;
  deleteDialog.value = true;
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  todoToDelete.value = null;
};

const confirmDeleteTask = () => {
  const index = todos.value.indexOf(todoToDelete.value);
  if (index !== -1) todos.value.splice(index, 1);
  showSnackbar(`Deleted: "${todoToDelete.value.text}"`);
  closeDeleteDialog();
};

const checkIfTruncated = (text, index) => {
  nextTick(() => {
    const el = document.getElementById(`truncate-text-${index}`);
    if (el) {
      isTruncatedMap.value[index] = el.scrollWidth > el.clientWidth;
    }
  });
};

const rules = [(value) => !!value || "Task Required."];

const handleAppendClick = () => {
  const result = rules[0](task.value);
  if (result === true) {
    taskError.value = "";
    onAddTodos();
  } else {
    taskError.value = result;
  }
}

const filteredTodos = computed(() => {
  let filtered = [];
  if (filterType.value === "completed") {
    filtered = todos.value.filter((todo) => todo.completed);
  } else if (filterType.value === "incomplete") {
    filtered = todos.value.filter((todo) => !todo.completed);
  } else {
    filtered = todos.value;
  }
  return filtered.slice().reverse();
});

const completionRate = computed(() => {
  if (todos.value.length === 0) return 0;
  const completed = todos.value.filter((t) => t.completed).length;
  return Math.round((completed / todos.value.length) * 100);
});

const showSnackbar = (message) => {
  snackbarText.value = message;
  snackbar.value = true;
};

watch(deleteDialog, (val) => {
  if (!val) todoToDelete.value = null;
});
</script>

<template>
  <VContainer fluid class="py-8">
    <VRow justify="center">
      <VCol cols="12" sm="10" md="6">
        <VCard class="pa-4 card" elevation="8">
          <div class="top-section">
            <div class="d-flex justify-space-between align-center mb-4">
              <h2 class="text-h6 font-weight-bold">Todo List</h2>
            </div>

            <VTextField
              v-model="task"
              :error="!!taskError"
              :error-messages="taskError"
              :rules="rules"
              label="Add New Task"
              append-icon="mdi-plus"
              @click:append="handleAppendClick"
              @keyup.enter="handleAppendClick"
              clearable
              variant="outlined"
              class="mb-4"
            />

            <div class="text-center mb-4">
              <VBtnToggle v-model="filterType" mandatory color="primary" rounded>
                <VBtn value="all">All</VBtn>
                <VBtn value="incomplete">Incomplete</VBtn>
                <VBtn value="completed">Completed</VBtn>
              </VBtnToggle>
            </div>

            <div class="text-center mb-4">
              <div class="mb-2 font-weight-medium">Completion Rate</div>
              <VProgressLinear
                :model-value="completionRate"
                color="green"
                height="10"
                rounded
              />
            </div>
          </div>

          <div class="todo-list-wrapper">
            <VList class="overflow-y-auto">
              <template v-if="filteredTodos.length">
                <VListItem
                  v-for="(todo, i) in filteredTodos"
                  :key="todo.text + i"
                  class="py-2 pr-0 pl-0"
                >
                  <div class="list-item-row">
                    <div class="left-content">
                      <VAvatar size="28" color="primary">
                        <VIcon>{{
                          todo.completed ? "mdi-check-circle" : "mdi-circle-outline"
                        }}</VIcon>
                      </VAvatar>

                      <div class="truncate-text-container">
                        <template v-if="isTruncatedMap[i]">
                          <VMenu
                            v-model="todo.showOverlay"
                            open-on-hover
                            :close-on-content-click="false"
                            location="top center"
                            content-class="pa-4"
                            style="z-index: 1000"
                            @mouseleave="todo.showOverlay = true"
                          >
                            <template #activator="{ props }">
                              <span
                                class="hover-reveal truncate-text"
                                v-bind="props"
                                :id="`truncate-text-${i}`"
                                @mouseenter="checkIfTruncated(todo.text, i)"
                              >
                                {{ todo.text }}
                              </span>
                            </template>

                            <template #default>
                              <VCard>
                                <VCardText>
                                  {{ todo.text }}
                                </VCardText>
                              </VCard>
                            </template>
                          </VMenu>
                        </template>

                        <template v-else>
                          <span
                            class="truncate-text"
                            :id="`truncate-text-${i}`"
                            @mouseenter="checkIfTruncated(todo.text, i)"
                          >
                            {{ todo.text }}
                          </span>
                        </template>
                      </div>
                    </div>

                    <div class="action-buttons">
                      <VBtn
                        icon
                        v-if="!todo.completed"
                        @click="markComplete(todo)"
                        color="success"
                        variant="tonal"
                      >
                        <VIcon>mdi-check</VIcon>
                      </VBtn>
                      <VBtn
                        icon
                        @click="openDeleteDialog(todo)"
                        color="error"
                        variant="tonal"
                      >
                        <VIcon>mdi-delete</VIcon>
                      </VBtn>
                    </div>
                  </div>
                </VListItem>
              </template>

              <template v-else>
                <VListItem>
                  <VListItemTitle class="text-center text-medium-emphasis font-italic">
                    No tasks to show
                  </VListItemTitle>
                </VListItem>
              </template>
            </VList>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle class="text-h6">Confirm Delete</VCardTitle>
        <VCardText>
          Are you sure you want to delete this task?
          <div class="mt-2 font-weight-bold">
            {{ todoToDelete ? todoToDelete.text : "" }}
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="closeDeleteDialog">Cancel</VBtn>
          <VBtn color="error" text @click="confirmDeleteTask">Delete</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar
      v-model="snackbar"
      :timeout="1500"
      color="info"
      location="top right"
      rounded
    >
      {{ snackbarText }}
    </VSnackbar>
  </VContainer>
</template>

<style scoped>
.list-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: hidden;
  gap: 12px;
}

.left-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 8px;
}

.truncate-text-container {
  display: flex;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.hover-reveal {
  cursor: text;
}

.todo-list-wrapper {
  max-height: 300px;
  overflow-y: auto;
}

.card {
  min-height: 400px;
  max-width: 650px;
  margin: 0 auto;
  border-radius: 12px;
}

.top-section {
  max-height: 280px;
  overflow-y: auto;
  position: relative;
}
</style>
