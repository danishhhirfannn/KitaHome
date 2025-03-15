<template>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="elevation-2 rounded-xl overflow-hidden pa-5" max-width="500">
        <v-card-title class="text-h5 font-weight-bold text-left">Select Your Residence</v-card-title>
        <p class="text-left text-caption mb-8 mt-n2">Choose your residence and enter your unit number.</p>
  
        <!-- Progress Bar -->
        <v-progress-linear :value="50" color="primary" height="10"></v-progress-linear>
  
        <v-card-text>
          <v-form @submit.prevent="saveResidenceDetails">
            <!-- Residence Selection -->
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
  
            <!-- Unit Number Input -->
            <v-text-field v-model="unitNumber" label="Unit Number" variant="outlined" density="comfortable" required></v-text-field>
  
            <v-btn type="submit" color="primary" block class="mt-4" :loading="loading">
              Continue
            </v-btn>
          </v-form>
        </v-card-text>
  
        <v-alert v-if="errorMessage" type="error" class="mt-3">{{ errorMessage }}</v-alert>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { supabase } from "@/api/supabase";
  
  const residenceID = ref(null);
  const residences = ref([]);
  const unitNumber = ref("");
  const loading = ref(false);
  const errorMessage = ref("");
  const router = useRouter();
  
  // Fetch residence options from database
  onMounted(async () => {
    const { data, error } = await supabase
      .from("Residence")
      .select("residenceID, residenceName, displayPhotoUrl");
  
    if (error) {
      errorMessage.value = "Failed to load residences.";
    } else {
      residences.value = data;
    }
  });
  
  // Save selected residence & unit number
  const saveResidenceDetails = async () => {
    loading.value = true;
    try {
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user?.user) throw new Error("User not found.");
  
      await supabase.from("User").update({
        residenceID: residenceID.value,
        unit_number: unitNumber.value,
      }).eq("userID", user.user.id);
  
      // Redirect to Step 3 (Upload Identification)
      router.push("/upload-id");
    } catch (err) {
      errorMessage.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Adjust spacing */
  .v-progress-linear {
    margin-bottom: 10px;
  }
  </style>