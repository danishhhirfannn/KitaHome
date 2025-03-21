<template>
  <div class="d-flex justify-center align-center gradient-bg pr-10 pl-10">
    <v-row justify="center" align="center" class="fill-height">
      <v-col justify="center" align="center">
        <!-- Logo -->
        <v-img :src="KitaHomeLogo" alt="KitaHome Logo" class="mt-2 mb-2 ml-4" contain :width="750"></v-img>
      </v-col>
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-5 d-flex flex-column align-center border flex-grow-1 pa-8" color="content" rounded="xl" border="border double opacity-100 md" :width="450" variant="elevated">

          <!-- Title & Subtitle -->
          <v-card-title class="text-center font-weight-bold text-h4">Welcome Back!</v-card-title>
          <v-card-subtitle class="ma-n2">Please enter your credentials</v-card-subtitle>

          <!-- Login Form -->
          <v-card-text class="w-100 mt-8 pl-0 pr-0">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              variant="outlined"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              variant="outlined"
              required
            ></v-text-field>
          </v-card-text>

          <!-- Buttons -->
          <v-btn rounded="xl" color="primary" variant="flat" @click="login" class="font-weight-medium w-100">Login</v-btn>

          <!-- Alt Message -->
          <p class="text-center mt-12 text-caption">Don't have an account? <router-link to="/signup" class="text-blue-darken-2 font-weight-bold">Sign Up Here</router-link></p>
    
          <!-- Error Message -->
          <p v-if="errorMessage" class="text-red text-center mt-2">{{ errorMessage }}</p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/api/supabase";
import KitaHomeLogo from "@/assets/KitaHome_Logo.png";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  errorMessage.value = "";
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // Fetch user data from the "User" table
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("userID, isAdmin, isManagement, isResident, isVerified")
      .eq("userID", data.user.id)
      .single();

    if (userError) throw userError;

    // Redirect users based on their role
    if (userData.isAdmin) {
      router.push("/admin-dashboard");
    } else if (userData.isManagement) {
      router.push("/management-dashboard");
    } else if (userData.isResident && userData.isVerified) {
      router.push("/resident-dashboard");
    } else {
      errorMessage.value = "Unauthorized role.";
    }
  } catch (err) {
    errorMessage.value = err.message;
  }
};
</script>

<style scoped>
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; filter: brightness(1); }
  25% { background-position: 50% 100%; filter: brightness(1.1); }
  50% { background-position: 100% 50%; filter: brightness(1); }
  75% { background-position: 50% 0%; filter: brightness(0.9); }
  100% { background-position: 0% 50%; filter: brightness(1); }
}

.gradient-bg {
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 60%),
              linear-gradient(-45deg, #0d47a1, #1976d2, #42a5f5, #64b5f6, #90caf9, #bbdefb);
  background-size: 300% 300%;
  animation: gradientAnimation 8s ease infinite;
  height: 100vh;
  align-content: center;
}

.text-red {
  color: red;
}

@media (max-width: 600px) {
  .gradient-bg {
    padding: 0 12px; /* Add padding to prevent side cut-off */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .v-img {
    width: 60% !important; /* Make logo responsive */
    max-width: 200px;
    margin-bottom: -10px !important; /* Bring it closer */
  }

  .v-card {
    width: 100% !important; /* Full width on mobile */
    max-width: 350px; /* Prevent it from getting too large */
    padding: 20px !important; /* Adjust spacing */
  }

  .v-card-title {
    font-size: 1.5rem !important; /* Adjust title size */
  }

  .v-card-subtitle {
    font-size: 0.9rem !important;
  }

  .v-text-field {
    font-size: 1rem !important; /* Ensure form fields are readable */
  }

  .v-btn {
    font-size: 1rem !important;
    padding: 12px !important; /* Make button tap-friendly */
  }
}
</style>