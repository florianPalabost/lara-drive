<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import SecondaryButton from "@/Components/SecondaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import { useForm } from "@inertiajs/vue3";
import { nextTick, ref } from "vue";

const props = defineProps(["folder"]);

const confirmingUserDeletion = ref(false);
const passwordInput = ref(null);

const form = useForm({
    name: "",
    path: "",
    parent_id: null,
});

const addFolder = () => {
    // debugger;
    const folderPath = props.folder ? props.folder.path : "";
    form.path = folderPath + "/" + form.name;

    if (props.folder) {
        form.parent_id = props.folder.id;
    }

    form.post(route("folders.store"), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    confirmingUserDeletion.value = false;

    form.reset();
};
</script>

<template>
    <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900">Add Folder</h2>

        <div class="mt-6">
            <InputLabel for="name" value="Name" class="sr-only" />

            <TextInput
                id="name"
                ref="nameInput"
                v-model="form.name"
                type="text"
                class="mt-1 block w-3/4"
                placeholder="name"
                @keyup.enter="addFolder"
            />

            <TextInput
                id="path"
                ref="pathInput"
                v-model="form.path"
                type="hidden"
                class="mt-1 block w-3/4"
                placeholder="path"
            />

            <InputError :message="form.errors.name" class="mt-2" />
        </div>

        <div class="mt-6 flex justify-end">
            <SecondaryButton @click="closeModal"> Cancel </SecondaryButton>

            <PrimaryButton
                class="ms-3"
                :class="{ 'opacity-25': form.processing }"
                :disabled="form.processing"
                @click="addFolder"
            >
                Add
            </PrimaryButton>
        </div>
    </div>
</template>
