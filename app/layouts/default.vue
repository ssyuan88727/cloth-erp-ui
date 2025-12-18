<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar flat border>
      <v-btn link icon="mdi-home" to="/" />
      <v-spacer />
      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.mdAndUp">
      <v-list nav>
        <v-list-group v-for="(group, key) in menuItems" :key="key" :value="key">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="group.icon"
              :title="group.title"
            />
          </template>

          <v-list-item
            v-for="child in group.children"
            :key="child.path"
            :title="child.displayName"
            :to="child.path"
            prepend-icon="mdi-circle-medium"
            link
          />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-sheet width="100%" min-height="80vh">
          <slot />
        </v-sheet>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
const router = useRouter();

const { mdAndUp } = useDisplay();
// 控制側邊欄開關狀態
// 初始值：如果是桌機版(md以上)則預設開啟，否則預設關閉
const drawer = ref(mdAndUp.value);
const openedGroups = ref<string[]>([]);

// 監聽螢幕尺寸變化，當視窗拉大時自動恢復導航欄
watch(mdAndUp, (val) => {
  if (val) drawer.value = true;
});

// 1. 建立選單資料結構
const menuItems = computed(() => {
  const allRoutes = router.getRoutes();

  // 過濾掉首頁與不需要顯示的系統路由
  const filtered = allRoutes.filter(
    (r) => r.path !== "/" && !r.path.includes(":")
  );

  // 依照路徑的第一層目錄進行分組 (例如 /supplier)
  const groups: Record<string, any> = {};

  filtered.forEach((route) => {
    const parts = route.path.split("/").filter(Boolean);
    const parent = parts[0] || "others";

    if (!groups[parent]) {
      let title: string = "";
      let icon: string = "";
      switch (parent) {
        case "supplier":
          title = "供應商";
          icon = "mdi-factory";
          break;
        case "setting":
          title = "設定";
          icon = "mdi-cog";
          break;
        case "member":
          title = "會員";
          icon = "mdi-account";
          break;
        case "store":
          title = "店鋪";
          icon = "mdi-store";
          break;
        default:
          title = parent.toUpperCase();
          icon = "mdi-folder";
          break;
      }
      groups[parent] = { title, icon, children: [] };
    }

    groups[parent].children.push({
      title: route.name || route.path,
      path: route.path,
      // 根據名稱美化標題
      displayName: String(route.name).replace(`${parent}-`, "") || "首頁",
    });
  });
  return groups;
});
</script>
