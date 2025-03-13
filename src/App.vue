<template>
  <v-app>
    <!-- Only show layout if user is logged in -->
    <template v-if="isLoggedIn">
      <!-- Admin & Management Layout -->
      <template v-if="isAdmin || isManagement">

        <!-- Navigation Drawer -->
        <v-navigation-drawer app v-model="drawer" floating permanent color="#FAFAFA">
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-content class="d-flex align-center">
                  <v-img :src="KitaHomeLogo" alt="KitaHome Logo" :width="200" class="mt-2 mb-2 ml-4" contain></v-img>
                </v-list-item-content>
                <v-list-item-title class="text-overline text-left mt-3 mb-2 font-weight-bold text-textSecondary">
                  Main Menu
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list dense>
              <v-list-item 
                v-for="(item, index) in menuItems" 
                :key="index" 
                :to="item.to" 
                :class="{ 'active-item': $route.path === item.to }" 
                link rounded="lg" 
                style="margin-left: 12px;">
                <v-list-item-content class="d-flex align-center">
                  <v-icon class="mr-3" size="20">{{ item.icon }}</v-icon>
                  <v-list-item-title class="font-weight-medium text-body-2">{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list>
          <!-- Logout Button at the Bottom -->
          <template v-slot:append>
            <v-list-item @click="logout" link>
              <v-icon class="mr-3" color="red">mdi-logout</v-icon>
              <v-list-item-title class="text-red font-weight-medium">Logout</v-list-item-title>
            </v-list-item>
          </template>
        </v-navigation-drawer>

        <v-main>
          <v-container fluid class="content-container d-flex flex-column fill-height pa-4">
            <v-sheet class="content-sheet border flex-grow-1 pa-8" color="content" rounded="xl" border="border double opacity-100 md">
              <router-view></router-view>
            </v-sheet>
          </v-container>
        </v-main>
      </template>

      <!-- Resident Layout -->
      <template v-if="isResident">
        <v-main>
          <router-view />
        </v-main>

        <v-bottom-navigation app color="primary">
          <v-btn to="/home">
            <v-icon>mdi-home</v-icon>
            <span>Home</span>
          </v-btn>
          <v-btn to="/complaints">
            <v-icon>mdi-alert-circle</v-icon>
            <span>Complaints</span>
          </v-btn>
          <v-btn to="/profile">
            <v-icon>mdi-account</v-icon>
            <span>Profile</span>
          </v-btn>
          <v-btn @click="logout">
            <v-icon color="red">mdi-logout</v-icon>
            <span class="text-red">Logout</span>
          </v-btn>
        </v-bottom-navigation>
      </template>
    </template>

    <!-- Login / Signup Pages (No Navigation) -->
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "./api/supabase";
import KitaHomeLogo from "./assets/KitaHome_Logo.png"

const router = useRouter();
const isLoggedIn = ref(false);
const isAdmin = ref(false);
const isManagement = ref(false);
const isResident = ref(false);
const drawer = ref(true);
let authListener = null;

const menuItems = [
  { title: "Home", icon: "mdi-home", to: "/management-dashboard" },
  { title: "About", icon: "mdi-information", to: "/about" },
  { title: "Profile Management", icon: "mdi-account", to: "/profile-management" },
];

// Function to fetch user role
const fetchUserRole = async (userId) => {
  if (!userId) return;

  const { data: userData, error } = await supabase
    .from("User")
    .select("isAdmin, isManagement, isResident")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user role:", error.message);
    return;
  }

  if (userData) {
    isAdmin.value = userData.isAdmin;
    isManagement.value = userData.isManagement;
    isResident.value = userData.isResident;
    isLoggedIn.value = true;
  }
};

// Handle auth state changes
const handleAuthChange = async (event, session) => {
  if (session?.user) {
    await fetchUserRole(session.user.id);
  } else {
    isLoggedIn.value = false;
    isAdmin.value = false;
    isManagement.value = false;
    isResident.value = false;
  }
};

// Logout function
const logout = async () => {
  await supabase.auth.signOut();
  isLoggedIn.value = false;
  isAdmin.value = false;
  isManagement.value = false;
  isResident.value = false;
  router.push("/"); // Redirect to login page
};

// Listen for authentication state changes
onMounted(async () => {
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    await fetchUserRole(user.user.id);
  }

  // Attach auth state change listener
  authListener = supabase.auth.onAuthStateChange(handleAuthChange);
});

onBeforeUnmount(() => {
  // Cleanup the listener when component unmounts
  if (authListener) authListener.subscription.unsubscribe();
});
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

/* Make bottom navigation always visible on mobile */
@media (max-width: 600px) {
  .v-main {
    padding-bottom: 60px;
  }

  .v-bottom-navigation {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }
}

/* Active Menu Item */
.active-item {
  background-color: #FAFAFA !important;
  color: #212529 !important;
  border: 1px solid #E5E5E5 !important; 
  border-radius: 18px !important;
}

.v-list-item {
  display: flex;
  align-items: center !important;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Completely removes the scrollbar */
}

#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Ensures no unwanted scrollbars */
}

</style>