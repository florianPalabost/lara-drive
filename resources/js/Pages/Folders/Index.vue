<script setup>
import { Head } from "@inertiajs/vue3";
import { TreeView } from "@grapoza/vue-tree";
import { ref } from "vue";
import axios from "axios";

const props = defineProps(["folderTree"]);

const nodes = ref([]);
const files = ref([]);
props.folderTree.forEach((folder, index) => {
    nodes.value.push({
        id: folder.id,
        label: folder.name,
        children: [
            { id: "node1" + index, label: "Child Node" },
            { id: "node2" + index, label: "Second Child" },
        ],
    });
});

const retrieveChildren = async (node) => {
    // debugger;
    // node.state.isLoading = true;

    await axios
        .get(`/folders/${node.id}/files`)
        .then((response) => {
            console.log(response.data);

            const rawFiles = response.data.data.filter(
                (f) => typeof f.id === "string"
            );

            // TODO: format
            files.value = rawFiles;

            // TODO: it's for subfolders
            // const childrenNodes = children.map((file) => {
            //     return {
            //         id: file.id,
            //         label: file.name,
            //         children: [],
            //     };
            // });
            // nodes.value = nodes.value.map((n) => {
            //     if (n.id === node.id) {
            //         return {
            //             ...n,
            //             children: childrenNodes,
            //         };
            //     }
            //     return n;
            // });
            // nodes.value[node.id].children = childrenNodes;
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            // node.state.isLoading = false;
        });
};

const modelDefaults = ref({
    selectable: true,
    expandable: true,
    // state: { expanded: true },
    loadChildrenAsync: retrieveChildren,
});

const handleClick = (node) => {
    console.log(node);
};
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
                @treeNodeClick="handleClick"
            ></tree-view>
        </div>
        <div class="bg-white flex-1 p-4">
            <h2 class="text-2xl font-bold mb-4">Files</h2>
            <!-- Main column for files -->
            <div class="grid grid-cols-1 gap-4">
                <div
                    v-for="file in files"
                    :key="file.id"
                    class="bg-gray-200 p-4 w-full"
                >
                    <div class="flex justify-between">
                        <span>{{ file.name }}</span>
                        <div class="flex gap-2">
                            <button
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit
                            </button>
                            <button
                                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <!-- <div>{{ file.id }}</div> -->
                </div>
            </div>
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

<style>
/* fix expander not displayed  */
.grtv-wrapper.grtv-default-skin
    .grtvn-self-expander
    i.grtvn-self-expanded-indicator {
    font-style: normal;
    padding: 0 0.25em;
}

.grtv-wrapper.grtv-default-skin
    .grtvn-self-expander
    i.grtvn-self-expanded-indicator::before {
    content: ">";
}

.grtv-wrapper.grtv-default-skin
    .grtvn-self-expander.grtvn-self-expanded
    i.grtvn-self-expanded-indicator::before {
    content: "^";
    vertical-align: "middle";
}

/* The styling for when the node is selected */
.grtv-wrapper.grtv-default-skin .grtvn-self-selected {
    background-color: #7c9aed;
}

.grtvn-children-wrapper.grtvn-children {
    padding-left: 5em !important;
}
.grtvn-children-wrapper ul {
    padding: revert;
}
</style>
