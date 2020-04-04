<template>
  <Status :detail="true"></Status>
</template>

<script>
import Status from "@/components/Chain/Status";

// @ is an alias to /src
export default {
  name: "Home",
  components: {
    Status
  }
}
</script>
