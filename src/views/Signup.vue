<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="elevation-2 rounded-xl overflow-hidden pa-5" max-width="500">
      <v-card-title class="text-h5 font-weight-bold text-left">
        {{ stepTitle }}
      </v-card-title>
      <p class="text-left text-caption mb-4">{{ stepDescription }}</p>

      <!-- Progress Bar -->
      <v-progress-linear :value="progress" color="indigo" height="8"></v-progress-linear>

      <v-card-text>
        <v-form @submit.prevent="handleNextStep">
          <!-- Step 1: User Information -->
          <template v-if="step === 1">
            <v-text-field v-model="fullName" label="Full Name" variant="outlined" density="comfortable" required></v-text-field>
            <v-text-field v-model="email" label="Email" variant="outlined" density="comfortable" type="email" required></v-text-field>
            <v-text-field v-model="password" label="Password" variant="outlined" density="comfortable" type="password" required></v-text-field>
            <v-text-field v-model="phone" label="Phone Number" variant="outlined" density="comfortable" required></v-text-field>
          </template>

          <!-- Step 2: Select Residence -->
          <template v-if="step === 2">
            <v-select
              v-model="residenceID"
              :items="residences"
              item-title="residenceName"
              item-value="residenceID"
              label="Choose Your Residence"
              variant="outlined"
              density="comfortable"
              required
            >
              <template v-slot:selection="{ item }">
                <v-avatar size="40">
                  <v-img :src="item.raw.displayPhotoUrl" alt="Residence Image"></v-img>
                </v-avatar>
                <span class="ml-2">{{ item.raw.residenceName }}</span>
              </template>
            </v-select>

            <v-text-field v-model="unitNumber" label="Unit Number" variant="outlined" density="comfortable" required></v-text-field>
          </template>

          <!-- Step 3: Upload ID -->
          <template v-if="step === 3">
            <v-file-input
              label="Upload ID (IC/Passport)"
              accept="image/*"
              variant="outlined"
              density="comfortable"
              required
              v-model="identificationFile"
              @change="handleFileUpload"
            ></v-file-input>
          </template>

          <v-btn type="submit" color="primary" block class="mt-4" :loading="loading">
            {{ step === 3 ? "Finish" : "Continue" }}
          </v-btn>
        </v-form>

        <!-- Error Alert -->
        <v-alert v-if="errorMessage" type="error" class="mt-3">{{ errorMessage }}</v-alert>

        <!-- Step Navigation -->
        <v-btn v-if="step > 1" variant="text" class="mt-3" @click="step--">Back</v-btn>
      </v-card-text>

      <p class="text-body-2 text-center mt-3">
        Already have an account? <router-link to="/" class="text-primary">Login</router-link>
      </p>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/api/supabase";

const step = ref(1);
const loading = ref(false);
const errorMessage = ref("");
const userId = ref(null);

// Step 1: User Information
const fullName = ref("");
const email = ref("");
const password = ref("");
const phone = ref("");

// Step 2: Residence Selection
const residenceID = ref(null);
const residences = ref([]);
const unitNumber = ref("");

// Step 3: Upload ID
const identificationFile = ref(null);
const router = useRouter();

// Fetch residences from database
onMounted(async () => {
  try {
    const { data, error } = await supabase.from("Residence").select("residenceID, residenceName, displayPhotoUrl");
    if (error) throw new Error("Failed to load residences.");
    residences.value = data;
  } catch (err) {
    errorMessage.value = err.message;
  }
});

// Handle next step
const handleNextStep = async () => {
  if (step.value === 1) {
    step.value++;
  } else if (step.value === 2) {
    if (!residenceID.value || !unitNumber.value) {
      errorMessage.value = "Please select your residence and enter your unit number.";
      return;
    }
    await createAccount(); // Create account here
  } else if (step.value === 3) {
    await uploadIdentification();
  } else {
    step.value++;
  }
};

// Create Account (after residence selection)
const createAccount = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const { data, error } = await supabase.auth.signUp({ email: email.value, password: password.value });
    if (error) throw error;

    if (!data.user) throw new Error("User creation failed.");
    userId.value = data.user.id;

    const { error: insertError } = await supabase.from("User").insert({
      userID: userId.value,
      email: email.value,
      fullName: fullName.value,
      phone: phone.value,
      residenceID: residenceID.value,
      unitNumber: unitNumber.value,
      isResident: true,
      isVerified: false,
      isDeclined: false,
    });

    if (insertError) throw new Error("Failed to create user in database.");

    step.value++;
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Handle file selection
const handleFileUpload = (event) => {
  if (event && event.target && event.target.files.length > 0) {
    identificationFile.value = event.target.files[0]; // Store only the first file
  }
};

// Upload Identification
const uploadIdentification = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    if (!identificationFile.value) {
      throw new Error("No file selected. Please upload an ID before proceeding.");
    }
    if (!userId.value) {
      throw new Error("User ID is missing. Cannot upload identification.");
    }

    const file = identificationFile.value;

    // Ensure it's a valid File object
    if (!(file instanceof File)) {
      throw new Error("Invalid file format. Please upload a valid image.");
    }

    const filePath = `identifications/${userId.value}-${file.name}`;

    console.log("Uploading file to:", filePath);

    // Upload file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("identifications")
      .upload(filePath, file);

    if (uploadError) throw new Error("File upload failed: " + uploadError.message);

    console.log("Upload successful:", uploadData);

    // Get public URL
    const { data: fileData } = supabase.storage
      .from("identifications")
      .getPublicUrl(filePath);

    if (!fileData) throw new Error("Failed to fetch uploaded file URL.");

    console.log("File URL:", fileData.publicUrl);

    // Update user record with file URL
    const { error: updateError } = await supabase
      .from("User")
      .update({ identification_url: fileData.publicUrl })
      .eq("userID", userId.value);

    if (updateError) throw new Error("Failed to update user: " + updateError.message);

    console.log("User record updated with identification URL");

    router.push("/");
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Progress bar & step titles
const progress = computed(() => (step.value / 3) * 100);
const stepTitle = computed(() => ["Enter Your Details", "Select Your Residence", "Upload Identification"][step.value - 1]);
const stepDescription = computed(() => [
  "Signing up for KitaHome is fast and free.",
  "Choose your residence and enter your unit number.",
  "Upload a photo of your IC or passport for verification."
][step.value - 1]);
</script>
