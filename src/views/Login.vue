<template>
    <v-container>
      <v-card class="pa-5">
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
          <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="login">Login</v-btn>
        </v-card-actions>
        <p v-if="errorMessage" class="text-red">{{ errorMessage }}</p>
      </v-card>
    </v-container>
  </template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/api/supabase";

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
      .select("id, isAdmin, isManagement, isResident, isVerified")
      .eq("id", data.user.id)
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
.text-red {
  color: red;
}
</style>