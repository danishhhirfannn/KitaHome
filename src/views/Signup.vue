<template>
    <v-container>
      <v-card class="pa-5 mx-auto" max-width="500">
        <v-card-title>Resident Registration</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="register">
            <v-text-field v-model="fullName" label="Full Name" required></v-text-field>
            <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
            <v-text-field v-model="phone" label="Phone Number" required></v-text-field>
            <v-file-input label="Upload Identification Document" @change="handleFileUpload"></v-file-input>
            <v-btn type="submit" color="primary" block :loading="loading">Sign Up</v-btn>
          </v-form>
        </v-card-text>
        <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
      </v-card>
    </v-container>
  </template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/api/supabase";

const email = ref("");
const password = ref("");
const fullName = ref("");
const phone = ref("");
const idFile = ref(null);
const loading = ref(false);
const errorMessage = ref("");
const router = useRouter();

// Handle File Upload
const handleFileUpload = (event) => {
  idFile.value = event.target.files[0];
};

// Register Resident
const register = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    // Step 1: Register User in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    const userId = data.user.id;

    // Step 2: Upload Identification Document
    const filePath = `identifications/${userId}_${idFile.value.name}`;
    const { error: uploadError } = await supabase.storage
      .from("identifications")
      .upload(filePath, idFile.value, { upsert: true });

    if (uploadError) throw uploadError;

    const publicUrl = supabase.storage
      .from("identifications")
      .getPublicUrl(filePath).publicUrl;

    // Step 3: Insert user details into the "User" table
    const { error: dbError } = await supabase.from("User").insert({
      id: userId,
      email: email.value,
      fullName: fullName.value,
      phone: phone.value,
      isResident: true,
      isManagement: false,
      isAdmin: false,
      isVerified: false,
      identification_url: publicUrl,
    });

    if (dbError) throw dbError;

    alert("Registration successful! Awaiting admin approval.");
    router.push("/"); // Redirect to the login page
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>