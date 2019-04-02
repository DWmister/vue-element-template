<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  beforeCreate () {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function (h) {
    return h() // avoid warning message
  }
})
</script>
