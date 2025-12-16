<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar>
      <v-btn link icon="mdi-home" to="/" />
    </v-app-bar>

    <v-navigation-drawer>
      <v-list nav>
        <v-list-item
          v-for="r in routes"
          :key="r.path"
          :to="r.path"
          link
          :title="String(r.name)"
        />
        <v-list-item v-for="n in 5" :key="n" :title="`List Item ${n}`" link />
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center">
      <v-container fluid>
        <v-sheet width="100%" min-height="80hv">
          <slot />
        </v-sheet>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
const routes = useRouter()
  .getRoutes()
  .filter((r) => r.path !== "/");
const links = ["Dashboard", "Messages", "Profile", "Updates"];
</script>
