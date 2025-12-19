<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      elevation="2"
      class="bg-grey-lighten-4"
    >
      <div class="pa-4 text-center border-b">
        <h2 class="text-h6 font-weight-bold color-primary">CLOTH ERP</h2>
      </div>

      <v-list v-model:opened="openedGroups" nav>
        <template v-for="item in sortedMenuItems" :key="item.title">
          <v-list-group v-if="item.children" :value="item.title">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
              />
            </template>

            <v-list-item
              v-for="subItem in item.children"
              :key="subItem.path"
              :title="subItem.title"
              :to="subItem.path"
              variant="text"
              class="pl-8"
              density="compact"
            />
          </v-list-group>

          <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.path"
            color="primary"
          />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title class="text-subtitle-1 font-weight-bold">
        {{ currentPageTitle }}
      </v-app-bar-title>
      <v-spacer />
      <v-btn icon="mdi-bell-outline" variant="text" />
      <v-btn icon="mdi-account-circle" variant="text" />
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const drawer = ref(true);
const openedGroups = ref([]);
const route = useRoute();

// 1. 定義選單原始資料 (未來可改為由後端 API 傳入)
const menuData: Record<string, any> = {
  store: {
    title: "店鋪管理",
    icon: "mdi-store",
    children: [
      { title: "店鋪列表", path: "/store/store" },
      { title: "店鋪類別", path: "/store/storeType" },
    ],
  },
  member: {
    title: "會員中心",
    icon: "mdi-account",
    path: "/member/member",
  },
  supplier: {
    title: "供應商管理",
    icon: "mdi-factory",
    path: "/supplier/supplier",
  },
  product: {
    title: "商品管理",
    icon: "mdi-package-variant-closed",
    children: [
      { title: "商品管理", path: "/product/product" },
      { title: "顏色管理", path: "/product/color" },
      { title: "尺寸管理", path: "/product/size" },
      { title: "標籤管理", path: "/product/tag" },
    ],
  },
  setting: {
    title: "系統設定",
    icon: "mdi-cog",
    idx: 999,
    children: [{ title: "退回原因", path: "/setting/returnReason" }],
  },
};

// 2. 實作 idx 自動排序
const sortedMenuItems = computed(() => {
  return Object.values(menuData).sort(
    (a, b) => (a.idx ?? 999) - (b.idx ?? 999)
  );
});

// 3. 動態取得當前頁面標題
const currentPageTitle = computed(() => {
  // 遍歷選單找尋匹配路徑的標題
  for (const item of sortedMenuItems.value) {
    if (item.path === route.path) return item.title;
    if (item.children) {
      const sub = item.children.find((s: any) => s.path === route.path);
      if (sub) return sub.title;
    }
  }
  return "工作面板";
});
</script>

<style scoped>
/* 針對 Vuetify 的 Active Link 樣式微調 */
:deep(.v-list-item--active) {
  background-color: rgb(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary)) !important;
  border-right: 4px solid rgb(var(--v-theme-primary));
}
</style>
