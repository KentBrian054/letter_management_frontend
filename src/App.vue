
<template>
  <div id="app">
    <nav class="bg-white border-b shadow-sm">
      <div class="container mx-auto">
        <div class="flex items-center justify-between px-4">
          <div class="flex space-x-4">
            <router-link 
              to="/letters" 
              class="px-4 py-3 text-base font-semibold rounded-md transition-all duration-200 border-b-2"
              :class="{ 
                'text-blue-700 border-blue-700': currentRoute.path === '/letters',
                'text-gray-600 hover:text-blue-700 border-transparent': currentRoute.path !== '/letters'
              }"
              exact
            >
              Letters
            </router-link>
            <router-link 
              to="/recipients" 
              class="px-4 py-3 text-base font-semibold rounded-md transition-all duration-200 border-b-2"
              :class="{ 
                'text-blue-700 border-blue-700': currentRoute.path === '/recipients',
                'text-gray-600 hover:text-blue-700 border-transparent': currentRoute.path !== '/recipients'
              }"
            >
              Recipients
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Add your logo or additional navigation items here -->
          </div>
        </div>
      </div>
    </nav>

    <div class="container mx-auto p-8">
      <router-view class="content-wrapper"></router-view>
    </div>
  </div> <!-- Correctly close the div with id="app" -->
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const currentRoute = useRoute();
    return { currentRoute };
  }
}
</script>

