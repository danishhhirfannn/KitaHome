<template>
    <v-container fluid>
    <!-- Table Actions -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <v-btn color="primary" prepend-icon="mdi-account-hard-hat">
          Assign Role
        </v-btn>
        <v-btn color="success" prepend-icon="mdi-plus">
          Add User
        </v-btn>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          class="ml-4"
          hide-details
        />
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="users"
      item-value="userId"
      class="elevation-1"
      color="textPrimary"
      hide-default-footer
    >
      <!-- Checkbox -->
      <template v-slot:[`item.checkbox`]="{ item }">
        <v-checkbox v-model="selected" :value="item.userId" dense />
      </template>

      <!-- Verification -->
      <template v-slot:[`item.isVerified`]="{ item }">
        <v-chip :color="item.isVerified ? 'green' : 'red'" small>
          {{ item.isVerified ? "Verified" : "Pending" }}
        </v-chip>
      </template>

      <!-- Role -->
      <template v-slot:[`item.role`]="{ item }">
        <v-chip :color="getRoleColor(item)" small>
          {{ getRole(item) }}
        </v-chip>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]>
        <v-btn icon>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <v-pagination v-model="page" :length="5" class="mt-4" />
  </v-container>
  
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title>Upload Document</v-card-title>
      <v-card-text>
        <input type="file" @change="handleFileChange" />
        <v-btn @click="uploadFile" class="mt-3" color="primary">Upload</v-btn>
      </v-card-text>
    </v-card>

    <v-card v-if="uploadedUrl" class="mt-4 pa-4">
      <v-card-title>Uploaded File</v-card-title>
      <v-card-text>
        <a :href="uploadedUrl" target="_blank">View Document</a>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/api/supabase';

export default {
  data() {
    return {
      search: "",
      selected: [],
      page: 1,
      headers: [
        { text: "User ID", value: "userId", align: "start" },
        { text: "Email", value: "email" },
        { text: "Full Name", value: "fullName" },
        { text: "Phone", value: "phone" },
        { text: "Role", value: "role" },
        { text: "Verification", value: "isVerified" },
        { text: "", value: "actions", sortable: false }
      ],
      users: [],
    };
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const { data, error } = await supabase.from("User").select("*");
      if (error) {
        console.error("Error fetching users:", error.message);
        return;
      }
      this.users = data.map((user) => ({
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        isResident: user.isResident,
        isManagement: user.isManagement,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        identification_url: user.identification_url,
      }));
    },
    getRole(user) {
      if (user.isAdmin) return "Admin";
      if (user.isManagement) return "Management";
      if (user.isResident) return "Resident";
      return "Unknown";
    },
    getRoleColor(user) {
      if (user.isAdmin) return "blue";
      if (user.isManagement) return "orange";
      if (user.isResident) return "green";
      return "gray";
    },
    // Handle file selection
    handleFileChange(event) {
      this.file = event.target.files[0];
    },

    // Upload file to Supabase
    async uploadFile() {
      if (!this.file) {
        alert("Please select a file first.");
        return;
      }

      const fileName = `${Date.now()}-${this.file.name}`; // Ensure unique file names
      const { data, error } = await supabase.storage
        .from("identifications") 
        .upload(fileName, this.file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload Error:", error.message);
        alert("File upload failed.");
        return;
      }

      // Get Public URL of the uploaded file
      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(fileName);
      this.uploadedUrl = urlData.publicUrl;
    }
  },
}
</script>