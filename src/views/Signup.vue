<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="elevation-2 rounded-xl overflow-hidden" max-width="900">
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-12 d-flex flex-column justify-center bg-light">
          <v-img :src="KitaHomeLogo" alt="KitaHome Logo" contain max-height="50" class="mb-8 d-block"></v-img>
          <h2 class="text-h5 font-weight-bold text-left">Let us help you manage your home efficiently.</h2>
          <p class="text-body-2 mt-4 text-left">Our registration process is quick and easy, ensuring secure access to your residential community.</p>

          <v-card class="mt-8 pa-6 rounded-lg" color="indigo">
            <p class="text-body-2 text-left">KitaHome has transformed how we manage our community, making everything seamless and organized!</p>

            <!-- Avatar & Name Inline -->
            <v-card-actions class="mt-4 d-flex align-center">
              <v-avatar size="40">
                <v-img :src="Avatar" alt="Resident"></v-img>
              </v-avatar>
              <div class="d-flex flex-column align-start ml-3">
                <span class="font-weight-medium">Lucas Lim</span>
                <span class="font-weight-thin text-caption">Resident</span>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>

        
        <!-- Right Section - Registration Form -->
        <v-col cols="12" md="6" class="pa-8">
          <v-card-title class="text-h5 font-weight-bold text-left pl-0">Create your account now</v-card-title>
          <p class="text-left text-caption mb-8 mt-n2">Signing up for KitaHome is fast and 100% free.</p>
          
          <v-form @submit.prevent="register">
            <v-text-field v-model="fullName" label="Full Name" variant="outlined" density="comfortable" required></v-text-field>
            <v-text-field v-model="email" label="Email" variant="outlined" density="comfortable" type="email" required></v-text-field>
            <v-text-field v-model="password" label="Password" variant="outlined" density="comfortable" type="password" required></v-text-field>
            <v-text-field v-model="phone" label="Phone Number" variant="outlined" density="comfortable" required></v-text-field>
            <v-file-input label="Upload Identification Document" variant="outlined" density="comfortable" @change="handleFileUpload"></v-file-input>
            
            <v-btn type="submit" color="primary" block class="mt-4" :loading="loading">
              Sign Up
            </v-btn>
          </v-form>
          
          <v-alert v-if="errorMessage" type="error" class="mt-3">{{ errorMessage }}</v-alert>
          <p class="text-body-2 text-center mt-3">Already have an account? <a href="/login" class="text-primary">Login</a></p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/api/supabase";
import KitaHomeLogo from "@/assets/KitaHome_Logo.png";
import Avatar from "@/assets/avatar.jpg";

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

<style scoped>
/* Adjust form spacing and readability */
.v-label {
  color: rgba(0, 0, 0, 0.7);
}

.v-text-field,
.v-file-input {
  max-width: 100%;
}

.v-btn {
  font-weight: 600;
}
</style>