<script lang="ts">
    import { getOrganizations, type Organization } from "$lib/common/getOrgs";
    import DataTable from "./tantan/components/data-table.svelte";
    import { columns } from "./tantan/components/columns.js";
    import * as m from "@paraglide/messages.js";

    let data = $state<Organization[]>([]);
    $effect(() => {
        void getOrganizations().then((orgs: Organization) => {
            data = orgs.organizations;
        });
    });
</script>

<!-- List -->
<h1 id="organizations" class="blog-content-title my-3">
    <a href="#organizations">{m.organizations()}</a>
</h1>

<!-- Table -->
<DataTable {data} {columns} />
