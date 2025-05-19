<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <div class="flex items-center gap-4">
      <!-- Title Search -->
      <div class="flex-1">
        <input
          type="text"
          v-model="localFilters.searchQuery"
          @input="updateFilters"
          class="w-full border rounded-md px-3 py-2"
          placeholder="Search by title..."
        />
      </div>

      <!-- Date Range -->
      <div class="flex items-center gap-2">
        <input
          type="date"
          v-model="localFilters.dateRange.start"
          @change="updateFilters"
          class="border rounded-md px-3 py-2 w-36"
        />
        <span>-</span>
        <input
          type="date"
          v-model="localFilters.dateRange.end"
          @change="updateFilters"
          class="border rounded-md px-3 py-2 w-36"
        />
      </div>

      <!-- Type Filter -->
      <div class="w-40">
        <select
          v-model="localFilters.selectedType"
          @change="updateFilters"
          class="w-full border rounded-md px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="Memo">Memo</option>
          <option value="Endorsement">Endorsement</option>
          <option value="Invitation Meeting">Invitation Meeting</option>
          <option value="Letter to Admin">Letter to Admin</option>
        </select>
      </div>

      <!-- Subject Search -->
      <div class="flex-1">
        <input
          type="text"
          v-model="localFilters.searchSubject"
          @input="updateFilters"
          class="w-full border rounded-md px-3 py-2"
          placeholder="Search by subject..."
        />
      </div>

      <!-- Recipient Search -->
      <div class="flex-1">
        <input
          type="text"
          v-model="localFilters.searchRecipient"
          @input="updateFilters"
          class="w-full border rounded-md px-3 py-2"
          placeholder="Search by recipient name or position..."
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilters',
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localFilters: {
        searchQuery: '',
        searchSubject: '',
        searchRecipient: '',
        selectedType: '',
        dateRange: {
          start: '',
          end: ''
        }
      },
      letterTypes: ['Memo', 'Endorsement', 'Invitation Meeting', 'Letter to Admin'] // Add letter types array
    }
  },
  methods: {
    updateFilters() {
      // Ensure type filter matches exact values
      if (this.localFilters.selectedType && !this.letterTypes.includes(this.localFilters.selectedType)) {
        this.localFilters.selectedType = '';
      }
      
      // Parse recipients if they exist in the search
      if (this.localFilters.searchRecipient) {
        const searchTerm = this.localFilters.searchRecipient.toLowerCase();
        this.localFilters.searchRecipient = searchTerm;
      }
      
      this.$emit('update:filters', this.localFilters);
    }
  }
}
</script>