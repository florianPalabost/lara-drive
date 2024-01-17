<script setup>
import { Head } from "@inertiajs/vue3";
import { TreeView } from "@grapoza/vue-tree";
import { ref } from "vue";
import axios from "axios";

const props = defineProps(["folderTree"]);

const nodes = ref([]);
props.folderTree.forEach((folder) => {
    nodes.value.push({
        id: folder.id,
        label: folder.name,
        children: [
            { id: 1, label: "Child Node" },
            { id: "node2", label: "Second Child" },
        ],
    });
});

const config = ref({
    roots: Object.keys(nodes.value),
});

const retrieveChildren = async (node) => {
    debugger;
    node.state.isLoading = true;

    await axios
        .get(`/folders/${folder.id}/files`)
        .then((response) => {
            console.log(response.data);
            const childrenNodes = response.data.map((file) => {
                return {
                    id: file.id,
                    label: file.name,
                    children: [],
                };
            });
            nodes.value[node.id].children = childrenNodes;
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            node.state.isLoading = false;
        });
};

const modelDefaults = ref({
    selectable: true,
    expandable: true,
    loadChildrenAsync: retrieveChildren,
});
</script>

<template>
    <Head title="Folder" />
    <!-- <AuthenticatedLayout> -->
    <div class="flex h-screen">
        <div class="bg-gray-200 w-1/4 p-4">
            <!-- Folder column -->
            <h2 class="text-2xl font-bold mb-4">Folders</h2>
            <tree-view
                :model-defaults="modelDefaults"
                id="folder-tree"
                :initial-model="nodes"
                selectionMode="single"
            ></tree-view>
        </div>
        <div class="bg-white flex-1 p-4">
            <h2 class="text-2xl font-bold mb-4">Files</h2>
            <!-- Main column for files -->
        </div>
    </div>

    <!--
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <UpdateProfileInformationForm
                        :must-verify-email="mustVerifyEmail"
                        :status="status"
                        class="max-w-xl"
                    />
                </div>

                <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <UpdatePasswordForm class="max-w-xl" />
                </div>

                <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <DeleteUserForm class="max-w-xl" />
                </div>
            </div>
        </div> -->
    <!-- </AuthenticatedLayout> -->
</template>
