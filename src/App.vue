<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer app v-model="drawer" floating permanent color="#FAFAFA">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">KitaHome</v-list-item-title>
            <v-list-item-title class="text-overline text-left mt-3 font-weight-bold text-textSecondary">Main Menu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list dense>
          <v-list-item v-for="(item, index) in items" :key="index" :to="item.to" :class="{ 'active-item': $route.path === item.to }" link rounded="lg" style="margin-left: 12px;" >
            <v-list-item-content class="d-flex align-center">
                <v-icon class="mr-3" size="20">{{ item.icon }}</v-icon>
              <v-list-item-title class="font-weight-medium text-body-2">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="content-container d-flex flex-column fill-height pa-4">
        <v-sheet class="content-sheet border flex-grow-1 pa-4" color="content" rounded="xl" border="border double opacity-100 md">
          <router-view></router-view>
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Home", icon: "mdi-home", to: "/" },
        { title: "About", icon: "mdi-information", to: "/about" },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: 'Inter' !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 20px);
  padding: 10px;
  background: #FAFAFA;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100vh !important;
}

.content-sheet {
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 20px;
  background: blue;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  flex-grow: 1 !important;
  display: flex;
  flex-direction: column;
}

/* .active-item {
  background-color: #FAFAFA !important;
  color: #212529 !important;
  border: 1px solid #E5E5E5 !important; 
  border-radius: 18px !important;
} */

.v-list-item {
  display: flex;
  align-items: center !important;
}


</style>
