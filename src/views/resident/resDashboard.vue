<template>
  <v-container>
    <h2 class="text-h5 text-center">Resident Dashboard</h2>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card class="pa-3">
          <v-icon>mdi-cash-multiple</v-icon>
          <p>View Fees</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="pa-3">
          <v-icon>mdi-alert-circle</v-icon>
          <p>File a Complaint</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@media (max-width: 600px) {
  .v-container {
    padding-bottom: 60px;
  }
}
</style>