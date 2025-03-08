<template>
    <img alt="Vue logo" src="../assets/logo.png">
    <v-container>
    <h1 class="text-center">User List</h1>
    <v-card v-for="user in users" :key="user.id" class="mb-4 pa-4">
      <p><strong>Name:</strong> {{ user.full_name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      <p><strong>Role:</strong> {{ user.isResident ? 'Resident' : 'Management' }}</p>
      <p><strong>Verified:</strong> {{ user.isVerified ? 'Yes' : 'No' }}</p>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/api/supabase';

export default {
  setup() {
    const users = ref([]);

    const fetchUsers = async () => {
      const { data, error } = await supabase.from('User').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        users.value = data;
      }
    };

    onMounted(fetchUsers);

    return { users };
  },
  name: 'Home',
  components: {
    
  }
}
</script>
