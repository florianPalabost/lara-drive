<script setup>
import { Head } from "@inertiajs/vue3";
import { TreeView } from "@grapoza/vue-tree";
import { ref } from "vue";
import axios from "axios";
import DefaultLayout from "@/Layouts/DefaultLayout.vue";
import Pagination from "@/Components/Pagination.vue";
import AddFolderForm from "@/Pages/Folders/AddFolderForm.vue";
import AddFileForm from "@/Pages/Files/AddFileForm.vue";
import Modal from "@/Components/Modal.vue";

const props = defineProps(["folderTree"]);

const nodes = ref([]);
const currentFolderFiles = ref([]);
const paginateFilesLink = ref([]);
const currentFolder = ref(null);
const currentFile = ref(null);
const addFolderModal = ref(false);
const addFileModal = ref(false);

props.folderTree.forEach((folder, index) => {
    nodes.value.push({
        id: folder.id,
        label: folder.name,
        children: [],
    });
});

const retrieveFiles = async (node) => {
    // debugger;
    // node.state.isLoading = true;

    await axios
        .get(`/folders/${node.id}/files`)
        .then((response) => {
            console.log(response.data);

            const rawFiles = response.data.data.filter(
                (f) => typeof f.id === "string"
            );
            debugger;
            if (response.data.links) {
                paginateFilesLink.value = response.data.links;
            }

            // TODO: format
            currentFolderFiles.value = rawFiles;

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

const retrieveChildrenFolders = async (node) => {
    currentFolder.value = node;
    return await axios
        .get(`/folders/${node.id}?include=children`)
        .then((response) => {
            console.log(response.data);

            if (response.data.children.length === 0) {
                return;
            }

            const childrenNodes = response.data.children.map((folder) => {
                return {
                    id: folder.id,
                    label: folder.name,
                    children: [],
                };
            });
            console.log(childrenNodes);

            return childrenNodes;
            // nodes.value = nodes.value.map((n) => {
            //     if (n.id === node.id) {
            //         return {
            //             ...n,
            //             children: childrenNodes,
            //         };
            //     }
            //     return n;
            // });
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
    loadChildrenAsync: retrieveChildrenFolders,
    customizations: {
        classes: {
            treeViewNode: "grtvn-self cursor-pointer",
            treeViewNodeSelfSelected: "grtvn-self-selected p-3",
            treeViewNodeSelfExpander: "grtvn-self-expander grtvn-self-folder",
        },
    },
});

const handleClick = async (node) => {
    console.log(node);
    await retrieveFiles(node);
};

const handleSelectFile = (file) => {
    currentFile.value = file;
};

const toggleAddFolderModal = () => {
    console.log("triggerAddFolderModal");
    addFolderModal.value = !addFolderModal.value;
};
const toggleAddFileModal = () => {
    console.log("toggleAddFileModal");
    addFileModal.value = !addFileModal.value;
};
</script>

<template>
    <Head title="Folder" />
    <DefaultLayout>
        <div class="flex" style="height: 95vh">
            <div class="bg-gray-200 w-1/4 p-4">
                <!-- Folder column -->
                <div class="flex justify-between mb-8">
                    <h2 class="text-2xl font-bold mb-4">Folders</h2>
                    <button
                        @click="toggleAddFolderModal"
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add
                    </button>
                </div>

                <hr class="mb-4 border-gray-300" />

                <tree-view
                    :model-defaults="modelDefaults"
                    id="folder-tree"
                    :initial-model="nodes"
                    selectionMode="single"
                    @treeNodeClick="handleClick"
                ></tree-view>
            </div>
            <div class="bg-white w-2/4 p-4">
                <div class="flex justify-between mb-8">
                    <Modal
                        v-if="addFolderModal"
                        :show="addFolderModal === true"
                        @close="toggleAddFolderModal"
                    >
                        <AddFolderForm
                            :folder="currentFolder"
                            @close="toggleAddFolderModal"
                        />
                    </Modal>
                    <h2 class="text-2xl font-bold mb-4">Files</h2>
                    <button
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add
                    </button>
                </div>
                <!-- Main column for files -->
                <div class="grid grid-cols-1 gap-4">
                    <div
                        v-for="file in currentFolderFiles"
                        :key="file.id"
                        class="bg-gray-200 p-4 w-full"
                    >
                        <div
                            class="flex justify-between"
                            @click="handleSelectFile(file)"
                        >
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

                    <Pagination
                        :links="paginateFilesLink"
                        class="mt-6"
                        v-if="paginateFilesLink.length > 0"
                    />
                </div>
            </div>
            <div class="flex-1 p-4 bg-blue-100">
                <h2 class="text-2xl font-bold mb-4">Informations</h2>
                <!-- Activity column -->
                <div class="bg-white p-4" v-if="currentFile">
                    <h3 class="text-xl font-bold mb-4">
                        {{ currentFile.name }}.{{ currentFile.extension }}
                    </h3>
                    <p>id : {{ currentFile.id }}</p>
                    <p>path : {{ currentFile.path }}</p>
                    <p>size : {{ currentFile.size }} U</p>
                    <p>add by : {{ currentFile.created_by }}</p>
                </div>

                <h2 class="text-2xl font-bold mb-4 mt-4">History</h2>
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
        <Modal
            v-if="addFileModal"
            :show="addFileModal === true"
            @close="toggleAddFileModal"
        >
            <AddFileForm :folder="currentFolder" @close="toggleAddFileModal" />
        </Modal>
    </DefaultLayout>
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
