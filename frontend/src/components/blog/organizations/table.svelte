<script lang="ts">
    import { getOrganizations, type Organization } from "$lib/common/getOrgs";
    import DataTable from "./tantan/components/data-table.svelte";
    import { columns } from "./tantan/components/columns.js";
    import * as m from "@paraglide/messages.js";

    const data = $state<Organization[]>(getOrganizations().organizations);
</script>

<!-- List -->
<h2 id="organizations" class="blog-content-title my-3">
    <a href="#organizations">{m.organizations()}</a>
</h2>

<!-- Table -->
<DataTable {data} {columns} />
